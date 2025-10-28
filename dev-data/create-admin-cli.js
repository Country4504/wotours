const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;

// 显示帮助信息
const showHelp = () => {
  console.log('🚀 Natours 管理员账户创建工具 (CLI版本)');
  console.log('');
  console.log('用法: node create-admin-cli.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  -h, --help                 显示帮助信息');
  console.log('  -n, --name <name>           设置管理员姓名');
  console.log('  -e, --email <email>         设置管理员邮箱');
  console.log('  -p, --password <password>   设置管理员密码');
  console.log('  -f, --force                强制创建，跳过确认');
  console.log('');
  console.log('示例:');
  console.log('  node create-admin-cli.js');
  console.log('  node create-admin-cli.js --name "系统管理员" --email admin@natours.com');
  console.log('  node create-admin-cli.js --email admin@natours.com --password Admin123456 --force');
  console.log('');
  console.log('默认值:');
  console.log('  - 姓名: 系统管理员');
  console.log('  - 邮箱: admin@natours.com');
  console.log('  - 密码: Admin123456');
  process.exit();
};

// 解析命令行参数
const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = {
    name: '系统管理员',
    email: 'admin@natours.com',
    password: 'Admin123456',
    force: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-h':
      case '--help':
        showHelp();
        break;
      case '-n':
      case '--name':
        result.name = args[++i];
        break;
      case '-e':
      case '--email':
        result.email = args[++i];
        break;
      case '-p':
      case '--password':
        result.password = args[++i];
        break;
      case '-f':
      case '--force':
        result.force = true;
        break;
      default:
        if (args[i].startsWith('-')) {
          console.error(`未知选项: ${args[i]}`);
          process.exit(1);
        }
    }
  }

  return result;
};

const createAdmin = async () => {
  try {
    const options = parseArgs();

    console.log('🚀 Natours 管理员账户创建工具 (CLI版本)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 验证输入
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(options.email)) {
      console.error('❌ 错误: 邮箱格式不正确！');
      process.exit(1);
    }

    if (options.password.length < 8) {
      console.error('❌ 错误: 密码长度至少为8位！');
      process.exit(1);
    }

    // 显示将要创建的信息
    console.log('');
    console.log('📋 将要创建的管理员账户信息:');
    console.log('   👤 姓名:', options.name);
    console.log('   📧 邮箱:', options.email);
    console.log('   🔑 角色: admin');
    console.log('   🔐 密码长度:', options.password.length, '位');
    console.log('');

    if (!options.force) {
      console.log('⚠️  确认创建管理员账户? (Ctrl+C 取消)');
      console.log('   等待 3 秒...');

      // 等待3秒，给用户时间取消
      await new Promise(resolve => setTimeout(resolve, 3000));
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
    const existingAdmin = await User.findOne({ email: options.email });
    if (existingAdmin) {
      console.log('⚠️  警告: 该邮箱已被注册！');
      console.log('   现有用户信息:');
      console.log('   - 姓名:', existingAdmin.name);
      console.log('   - 邮箱:', existingAdmin.email);
      console.log('   - 角色:', existingAdmin.role);

      if (!options.force) {
        console.log('');
        console.log('❌ 如果要覆盖现有账户，请使用 --force 参数');
        process.exit(1);
      } else {
        console.log('🔄 强制模式：删除现有账户并创建新账户...');
        await User.findByIdAndDelete(existingAdmin._id);
      }
    }

    // 创建管理员账户
    console.log('🔄 正在创建管理员账户...');
    const admin = await User.create({
      name: options.name,
      email: options.email,
      password: options.password,
      passwordConfirm: options.password,
      role: 'admin'
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
    console.log('   📧 邮箱:', options.email);
    console.log('   🔐 密码:', options.password);
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
    process.exit();
  }
};

createAdmin();