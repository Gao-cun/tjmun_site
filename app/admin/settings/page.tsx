import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

async function getSiteConfigs() {
  const configs = await prisma.siteConfig.findMany({
    orderBy: { key: "asc" },
  })
  return configs
}

export default async function AdminSettingsPage() {
  const configs = await getSiteConfigs()

  const configMap: Record<string, string> = {}
  configs.forEach((config) => {
    configMap[config.key] = config.value
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">网站设置</h1>
        <p className="mt-2 text-gray-600">管理网站配置信息</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>联系方式设置</CardTitle>
          <CardDescription>配置网站的联系信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">邮箱</label>
              <p className="mt-1 text-lg">
                {configMap["contact_email"] || "未设置"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">电话</label>
              <p className="mt-1 text-lg">
                {configMap["contact_phone"] || "未设置"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">地址</label>
              <p className="mt-1 text-lg">
                {configMap["contact_address"] || "未设置"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">微信公众号</label>
              <p className="mt-1 text-lg">
                {configMap["contact_wechat"] || "未设置"}
              </p>
            </div>
            <Button asChild className="mt-4">
              <a href="/admin/settings/edit">编辑设置</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

