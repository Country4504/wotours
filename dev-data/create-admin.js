const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const createAdmin = async () => {
  try {
    // 管理员用户信息 - 您可以根据需要修改这些信息
    const adminData = {
      name: '系统管理员',
      email: 'admin@natours.com',
      password: 'Admin123456',
      passwordConfirm: 'Admin123456',
      role: 'admin',
      photo: 'default.jpg',
      active: true
    };

    // 检查是否已存在管理员账户
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('管理员账户已存在！');
      console.log('邮箱:', adminData.email);
      process.exit();
    }

    // 创建管理员账户
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      passwordConfirm: adminData.passwordConfirm,
      role: adminData.role,
      photo: adminData.photo,
      active: adminData.active
    });

    console.log('✅ 管理员账户创建成功！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 管理员账户信息:');
    console.log('   👤 姓名:', admin.name);
    console.log('   📧 邮箱:', admin.email);
    console.log('   🔑 角色:', admin.role);
    console.log('   ✅ 状态:', admin.active ? '激活' : '未激活');
    console.log('   🆔 用户ID:', admin._id);
    console.log('');
    console.log('🔑 登录信息:');
    console.log('   📧 邮箱:', adminData.email);
    console.log('   🔐 密码:', adminData.password);
    console.log('');
    console.log('⚠️  重要提示:');
    console.log('   1. 请妥善保管管理员账户信息');
    console.log('   2. 建议首次登录后立即修改密码');
    console.log('   3. 请定期更换密码以确保系统安全');
    console.log('   4. 管理员拥有系统的最高权限');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (err) {
    console.error('❌ 创建管理员账户时发生错误:');
    console.error(err.message);

    if (err.code === 11000) {
      console.error('错误: 该邮箱已被注册，请使用其他邮箱');
    } else if (err.name === 'ValidationError') {
      console.error('错误: 数据验证失败');
      Object.values(err.errors).forEach(val => {
        console.error(`   - ${val.message}`);
      });
    } else {
      console.error('错误: 未知错误，请检查数据库连接和配置');
    }
  }
  process.exit();
};

// 如果需要自定义管理员信息，可以修改上面的 adminData 对象
// 然后运行此脚本创建管理员账户
createAdmin();