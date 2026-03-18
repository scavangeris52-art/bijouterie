import BlogEditor from "@/components/admin/BlogEditor";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <BlogEditor postId={params.id} />;
}
