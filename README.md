# Tlias 智能学习辅助系统（后端）

> Spring Boot 3 + MyBatis + MySQL 的部门 / 员工管理后端，包含分页条件查询、员工工作经历关联、文件上传等模块。
> 本项目为《Java 后端开发》课程实训作品，参考课程教学案例完成。

## 技术栈

| 层次 | 技术 |
|---|---|
| 框架 | Spring Boot 3.4.7（Java 17） |
| 持久层 | MyBatis 3.0.4 + PageHelper 1.4.7 |
| 数据库 | MySQL 8 |
| 工具 | Lombok、Logback 1.5.18 |
| 文件存储 | 阿里云 OSS SDK 3.17.4（可选） |

## 功能模块

**部门管理 `DeptController`**

- `GET /depts` 查询部门列表
- `GET /depts/{id}` 根据 ID 查询部门
- `POST /depts` 新增部门
- `PUT /depts` 修改部门
- `DELETE /depts?id=` 删除部门

**员工管理 `EmpController`**

- `GET /emps` 分页 + 条件查询（姓名模糊、性别、入职日期区间）
- `POST /emps` 新增员工（自动回填自增主键）

**文件上传 `UploadController`**

- `POST /upload` 上传文件到阿里云 OSS，返回访问 URL

## 目录结构

```
tlias-learning-system/
├── pom.xml
├── sql/
│   └── schema.sql                 # 建库建表脚本
└── src/
    ├── main/
    │   ├── java/com/itheima/
    │   │   ├── TliasApplication.java
    │   │   ├── controller/        # DeptController / EmpController / UploadController
    │   │   ├── service/           # 业务接口与实现
    │   │   ├── mapper/            # MyBatis Mapper 接口
    │   │   ├── pojo/              # 实体与统一返回结果 Result / PageResult
    │   │   └── utils/             # 阿里云 OSS 工具类
    │   └── resources/
    │       ├── application.yml
    │       ├── com/itheima/mapper/# Mapper XML
    │       ├── logback.xml
    │       └── static/upload.html # 上传测试页
    └── test/
```

## 快速开始

**1. 建库**

```bash
mysql -u root -p < sql/schema.sql
```

**2. 配置数据库（环境变量，推荐）**

```bash
# Windows PowerShell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="tlias"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="你的密码"
```

也可以直接改 `src/main/resources/application.yml`，但**不要把真实密码提交到仓库**。

**3. 启动**

```bash
mvn spring-boot:run
```

默认端口 `8080`。

**4. 文件上传（可选）**

上传功能依赖阿里云 OSS。需先设置环境变量：

```bash
$env:OSS_ACCESS_KEY_ID="..."
$env:OSS_ACCESS_KEY_SECRET="..."
```

并修改 `AliyunOSSOperator` 中的 `endpoint`、`bucketName`、`region` 为你自己的 Bucket 配置。不配置时其他接口不受影响。

## 说明

- 仓库不含 `target/`、`.idea/` 等构建与 IDE 产物。
- `sql/schema.sql` 的表结构依据实体类与 Mapper 语句还原，字段长度可能与原始库略有差异。
- 项目仅包含后端接口，未附带前端页面。
