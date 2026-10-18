-- Rulit 智能学习辅助系统 —— 数据库初始化脚本
-- 说明：表结构依据实体类（Dept / Emp / EmpExpr）与 MyBatis 映射语句还原，
--       字段长度按常见教学案例取值，可按实际业务调整。

CREATE DATABASE IF NOT EXISTS rulit DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE rulit;

-- 部门表
CREATE TABLE IF NOT EXISTS dept (
    id          INT PRIMARY KEY AUTO_INCREMENT COMMENT '部门ID',
    name        VARCHAR(20) NOT NULL COMMENT '部门名称',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '修改时间'
) COMMENT '部门表';

-- 员工表
CREATE TABLE IF NOT EXISTS emp (
    id          INT PRIMARY KEY AUTO_INCREMENT COMMENT '员工ID',
    username    VARCHAR(20) NOT NULL COMMENT '用户名',
    password    VARCHAR(32) COMMENT '密码',
    name        VARCHAR(20) NOT NULL COMMENT '姓名',
    gender      TINYINT COMMENT '性别：1 男，2 女',
    phone       VARCHAR(11) COMMENT '手机号',
    job         TINYINT COMMENT '职位：1 班主任，2 讲师，3 学工主管，4 教研主管，5 咨询师',
    salary      INT COMMENT '薪资',
    image       VARCHAR(300) COMMENT '头像地址',
    entry_date  DATE COMMENT '入职日期',
    dept_id     INT COMMENT '所属部门ID',
    create_time DATETIME COMMENT '创建时间',
    update_time DATETIME COMMENT '修改时间',
    UNIQUE KEY uk_emp_username (username),
    KEY idx_emp_dept (dept_id)
) COMMENT '员工表';

-- 员工工作经历表
CREATE TABLE IF NOT EXISTS emp_expr (
    id      INT PRIMARY KEY AUTO_INCREMENT COMMENT '经历ID',
    emp_id  INT COMMENT '员工ID',
    `begin` DATE COMMENT '开始日期',
    `end`   DATE COMMENT '结束日期',
    company VARCHAR(50) COMMENT '公司名称',
    job     VARCHAR(20) COMMENT '职位',
    KEY idx_expr_emp (emp_id)
) COMMENT '员工工作经历表';

-- 基础示例数据（可选）
INSERT INTO dept (name, create_time, update_time) VALUES
    ('教研部', NOW(), NOW()),
    ('学工部', NOW(), NOW()),
    ('咨询部', NOW(), NOW());
