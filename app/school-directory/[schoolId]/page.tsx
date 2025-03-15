import { Metadata } from "next"

interface PageProps {
  params: {
    schoolId: string
  }
}

export const generateMetadata = async ({}: PageProps): Promise<Metadata> => {
  return {
    title: "School Directory",
  }
}

function SchoolDirectoryPage({}: PageProps) {
  return <div>SchoolDirectoryPage</div>
}

export default SchoolDirectoryPage
