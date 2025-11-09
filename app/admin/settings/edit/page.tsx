import { prisma } from "@/lib/prisma"
import { SiteConfigForm } from "@/components/admin/site-config-form"

async function getSiteConfigs() {
  const configs = await prisma.siteConfig.findMany({
    where: {
      key: {
        in: ["contact_email", "contact_phone", "contact_address", "contact_wechat"],
      },
    },
  })
  return configs
}

export default async function EditSettingsPage() {
  const configs = await getSiteConfigs()

  const configMap: Record<string, string> = {}
  configs.forEach((config) => {
    configMap[config.key] = config.value
  })

  const initialData = {
    contact_email: configMap["contact_email"] || "",
    contact_phone: configMap["contact_phone"] || "",
    contact_address: configMap["contact_address"] || "",
    contact_wechat: configMap["contact_wechat"] || "",
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">编辑网站设置</h1>
        <p className="mt-2 text-gray-600">修改网站配置信息</p>
      </div>
      <SiteConfigForm initialData={initialData} />
    </div>
  )
}

