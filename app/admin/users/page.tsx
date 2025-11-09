import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return users
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">用户管理</h1>
        <p className="mt-2 text-gray-600">查看和管理所有用户</p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">暂无用户</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? "管理员" : "学生"}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">邮箱：</span>
                        {user.email}
                      </p>
                      {user.school && (
                        <p>
                          <span className="font-medium">学校：</span>
                          {user.school}
                        </p>
                      )}
                      {user.major && (
                        <p>
                          <span className="font-medium">专业：</span>
                          {user.major}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">报名次数：</span>
                        {user._count.registrations}
                      </p>
                      <p>
                        <span className="font-medium">注册时间：</span>
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

