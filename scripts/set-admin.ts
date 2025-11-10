import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ 用户 ${email} 不存在`)
      process.exit(1)
    }

    if (user.role === 'ADMIN') {
      console.log(`ℹ️  用户 ${email} 已经是管理员`)
      return
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })

    console.log(`✅ 成功将 ${email} 设置为管理员`)
    console.log(`   用户ID: ${updated.id}`)
    console.log(`   姓名: ${updated.name}`)
    console.log(`   角色: ${updated.role}`)
  } catch (error) {
    console.error('❌ 更新失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
if (!email) {
  console.error('❌ 请提供邮箱地址')
  console.log('用法: npx tsx scripts/set-admin.ts <email>')
  process.exit(1)
}

setAdmin(email)

