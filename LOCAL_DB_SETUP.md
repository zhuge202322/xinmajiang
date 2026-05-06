# Local Database Setup

本项目使用本地 JSON 文件作为数据库，无需额外配置即可运行。

## 数据库文件

数据库文件位于 `data/database.json`，包含以下数据：

- **users** - 用户数据
- **products** - 产品数据
- **orders** - 订单数据
- **addresses** - 收货地址数据

## 初始管理员账号

```
邮箱: admin@luundy.com
密码: admin123
```

## 管理产品

1. 登录管理员账号
2. 访问 /admin/products 即可管理产品

## 数据操作

所有数据操作通过 API 进行：

- GET/POST/PUT/DELETE `/api/products` - 产品管理
- GET/POST `/api/orders` - 订单管理
- POST `/api/auth/login` - 登录
- POST `/api/auth/register` - 注册
- GET/PUT `/api/users/profile` - 用户资料

## 备份

定期备份 `data/database.json` 文件即可保存所有数据。
