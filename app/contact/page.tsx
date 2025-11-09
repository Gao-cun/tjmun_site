import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getContactInfo() {
  const contactConfig = await prisma.siteConfig.findMany({
    where: {
      key: {
        in: ["contact_email", "contact_phone", "contact_address", "contact_wechat"],
      },
    },
  })

  const configMap: Record<string, string> = {}
  contactConfig.forEach((config) => {
    configMap[config.key] = config.value
  })

  return {
    email: configMap["contact_email"] || "contact@tjmun.edu.cn",
    phone: configMap["contact_phone"] || "021-6598xxxx",
    address: configMap["contact_address"] || "上海市杨浦区四平路1239号同济大学",
    wechat: configMap["contact_wechat"] || "TJMUN_Official",
  }
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">联系我们</h1>
        <p className="mt-2 text-gray-600">如有任何问题，欢迎通过以下方式联系我们</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
            <CardDescription>通过以下方式与我们取得联系</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">邮箱</label>
              <p className="mt-1 text-lg">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-primary hover:underline"
                >
                  {contactInfo.email}
                </a>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">电话</label>
              <p className="mt-1 text-lg">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-primary hover:underline"
                >
                  {contactInfo.phone}
                </a>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">地址</label>
              <p className="mt-1 text-lg">{contactInfo.address}</p>
            </div>
            {contactInfo.wechat && (
              <div>
                <label className="text-sm font-medium text-gray-500">微信公众号</label>
                <p className="mt-1 text-lg">{contactInfo.wechat}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>工作时间</CardTitle>
            <CardDescription>我们的服务时间</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">工作日</label>
              <p className="mt-1 text-lg">周一至周五：9:00 - 17:00</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">周末</label>
              <p className="mt-1 text-lg">周六至周日：10:00 - 16:00</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">节假日</label>
              <p className="mt-1 text-lg">请通过邮箱联系我们</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>常见问题</CardTitle>
          <CardDescription>您可能想了解的问题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">如何报名参加会议？</h3>
              <p className="text-gray-600">
                请先注册账号并登录，然后在会议列表中选择您感兴趣的会议，点击"立即报名"按钮即可。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">报名后如何查看状态？</h3>
              <p className="text-gray-600">
                登录后进入"个人中心"，您可以在"报名记录"中查看所有报名的状态和详细信息。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">如何支付会议费用？</h3>
              <p className="text-gray-600">
                报名审核通过后，您可以在个人中心查看支付信息。具体支付方式请关注会议详情页面的说明。
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">忘记密码怎么办？</h3>
              <p className="text-gray-600">
                目前暂不支持在线重置密码，如忘记密码，请通过邮箱联系我们，我们会协助您重置密码。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

