import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-semibold">关于我们</h3>
            <p className="text-sm text-gray-600">
              同济大学模拟联合国社团致力于培养具有全球视野和领导力的优秀学生。
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/announcements" className="text-gray-600 hover:text-gray-900">
                  最新公告
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="text-gray-600 hover:text-gray-900">
                  会议信息
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold">联系方式</h3>
            <p className="text-sm text-gray-600">
              更多信息请访问联系我们页面
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 同济大学模拟联合国社团. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

