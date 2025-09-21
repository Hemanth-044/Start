import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect, notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";

import EditStartupForm from "@/components/EditStartupForm";

async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  
  if (!session) redirect("/");

  const startup = await client.fetch(STARTUP_BY_ID_QUERY, { id });
  
  if (!startup) return notFound();

  // Check if current user is the author
  if (startup.author._id !== session.id) {
    redirect(`/startup/${id}`);
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Edit Your Startup Pitch</h1>
        <p className="sub-heading">Update your startup information and pitch details</p>
      </section>

      <section className="section_container">
        <EditStartupForm startup={startup} />
      </section>
    </>
  );
}

export default EditPage;
