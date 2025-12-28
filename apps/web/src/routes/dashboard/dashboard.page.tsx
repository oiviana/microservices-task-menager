import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/ui/Modal";

export default function DashboardPage() {
  return (
    <div>
      <CustomModal
        trigger={<Button>Nova tarefa</Button>}
        title="Adicionar nova tarefa"
        description="Preencha os dados para criar uma nova tarefa"
        maxWidth="max-w-md"
        maxHeight="max-h-[80vh]"
      >
        <h2>oi</h2>
      </CustomModal>
    </div>
  )
}