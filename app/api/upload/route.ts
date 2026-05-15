import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PUBLIC_PREFIX = '/uploads';
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

async function isAdminRequest(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) return true;
  if (process.env.NODE_ENV === 'development') return true;

  const cookieStore = await import('next/headers').then((m) => m.cookies());
  const sessionData = cookieStore.get('session')?.value;
  if (!sessionData) return false;
  try {
    const session = JSON.parse(sessionData);
    return Boolean(session?.user?.isAdmin);
  } catch {
    return false;
  }
}

function safeExt(filename: string, mime: string) {
  const fromName = path.extname(filename).toLowerCase().replace('.', '');
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
  if (allowed.includes(fromName)) return fromName === 'jpeg' ? 'jpg' : fromName;
  const fromMime = mime.split('/')[1];
  if (allowed.includes(fromMime)) return fromMime === 'jpeg' ? 'jpg' : fromMime;
  return 'bin';
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '未找到文件字段 file' }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: '文件为空' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `文件超过 ${Math.round(MAX_BYTES / 1024 / 1024)}MB 限制` },
        { status: 400 },
      );
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `不支持的文件类型：${file.type || '未知'}` },
        { status: 400 },
      );
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const ext = safeExt(file.name, file.type);
    const random = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${random}.${ext}`;
    const fullPath = path.join(UPLOAD_DIR, filename);

    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(fullPath, Buffer.from(arrayBuffer));

    const url = `${PUBLIC_PREFIX}/${filename}`;
    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message || '上传失败' },
      { status: 500 },
    );
  }
}
