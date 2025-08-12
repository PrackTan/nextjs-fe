import Verify from "@/components/auth/verify";
import { sendRequest } from "@/utils/api";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(">>>>>>>>>> check id", id);
  // const res = await sendRequest<IBackendRes<IRegister>>({
  //   url: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify/${id}`,
  //   method: "GET",
  // });
  return <Verify id={id} />;
}
