import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import Workflow from "@/components/Workspace/Workflow"
import GraphEditor from "@/components/Workspace/GraphEditor"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  return (
    <>
      <Workflow></Workflow>
    </>
  )
}
