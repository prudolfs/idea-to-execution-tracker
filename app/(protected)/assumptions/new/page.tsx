import { getIdeas } from "@/app/actions/ideas"
import { AssumptionForm } from "./assumption-form"

export default async function NewAssumptionPage() {
  const ideas = await getIdeas()

  return <AssumptionForm ideas={ideas} />
}

