import { ConferenceForm } from "@/components/admin/conference-form"

export default function NewConferencePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">创建新会议</h1>
        <p className="mt-2 text-gray-600">填写会议信息以创建新会议</p>
      </div>
      <ConferenceForm />
    </div>
  )
}

