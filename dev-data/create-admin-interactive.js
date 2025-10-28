const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/userModel');
const readline = require('readline');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

// 创建 readline 接口用于命令行交互
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 询问用户输入
const question = (query) => {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
};

const createAdmin = async () => {
  try {
    console.log('🚀 Natours 管理员账户创建工具');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // 获取管理员信息
    const name = await question('👤 请输入管理员姓名 (默认: 系统管理员): ');
    const email = await question('📧 请输入管理员邮箱 (默认: admin@natours.com): ');
    const password = await question('🔐 请输入管理员密码 (默认: Admin123456): ');
    const confirmPassword = await question('🔐 请确认密码: ');

    console.log('');

    // 设置默认值
    const adminData = {
      name: name || '系统管理员',
      email: email || 'admin@natours.com',
      password: password || 'Admin123456',
      passwordConfirm: confirmPassword || password || 'Admin123456',
      role: 'admin'
    };

    // 验证密码
    if (adminData.password !== adminData.passwordConfirm) {
      console.error('❌ 错误: 两次输入的密码不一致！');
      process.exit(1);
    }

    if (adminData.password.length < 8) {
      console.error('❌ 错误: 密码长度至少为8位！');
      process.exit(1);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      console.error('❌ 错误: 邮箱格式不正确！');
      process.exit(1);
    }

    // 连接数据库
    console.log('🔗 正在连接数据库...');
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('✅ 数据库连接成功！');

    // 检查是否已存在管理员账户
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  警告: 该邮箱已被注册！');
      console.log('   现有用户信息:');
      console.log('   - 姓名:', existingAdmin.name);
      console.log('   - 邮箱:', existingAdmin.email);
      console.log('   - 角色:', existingAdmin.role);

      const overwrite = await question('❓ 是否继续创建新账户? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('❌ 取消创建管理员账户');
        process.exit();
      }
    }

    // 确认信息
    console.log('');
    console.log('📋 确认管理员账户信息:');
    console.log('   👤 姓名:', adminData.name);
    console.log('   📧 邮箱:', adminData.email);
    console.log('   🔑 角色:', adminData.role);
    console.log('   🔐 密码长度:', adminData.password.length, '位');
    console.log('');

    const confirm = await question('✅ 确认创建管理员账户? (Y/n): ');
    if (confirm.toLowerCase() === 'n') {
      console.log('❌ 取消创建管理员账户');
      process.exit();
    }

    // 创建管理员账户
    console.log('🔄 正在创建管理员账户...');
    const admin = await User.create({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      passwordConfirm: adminData.passwordConfirm,
      role: adminData.role
    });

    console.log('');
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
    console.log('   🔐 密码:', '*'.repeat(adminData.password.length));
    console.log('');
    console.log('⚠️  重要提示:');
    console.log('   1. 请妥善保管管理员账户信息');
    console.log('   2. 建议首次登录后立即修改密码');
    console.log('   3. 请定期更换密码以确保系统安全');
    console.log('   4. 管理员拥有系统的最高权限');
    console.log('   5. 请定期备份数据库');
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
    process.exit(1);
  } finally {
    rl.close();
    process.exit();
  }
};

// 检查命令行参数
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🚀 Natours 管理员账户创建工具');
  console.log('');
  console.log('用法: node create-admin-interactive.js');
  console.log('');
  console.log('功能: 交互式创建管理员账户');
  console.log('');
  console.log('说明:');
  console.log('   - 运行脚本后，根据提示输入管理员信息');
  console.log('   - 支持自定义姓名、邮箱和密码');
  console.log('   - 自动验证输入数据的格式');
  console.log('   - 检查邮箱是否已被注册');
  console.log('   - 创建前需要确认信息');
  console.log('');
  console.log('默认信息:');
  console.log('   - 姓名: 系统管理员');
  console.log('   - 邮箱: admin@natours.com');
  console.log('   - 密码: Admin123456');
  process.exit();
}

createAdmin();