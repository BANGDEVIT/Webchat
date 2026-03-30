import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // zodResolver kết nối zod với zod với react hook form
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
// import { Input } from "@/components/ui/input";

const signInschema = z.object({
  username: z.string().min(3, "Tài khoản phải có ít nhất 3 ký tự."),
  password: z.string().min(8, "Mật khẩu có ít nhất 8 ký tự"),
});

type signInFormValues = z.infer<typeof signInschema>; // từ kiểu dữ liệu signUpschema tự suy ra kiểu signUpFormValues (ví dụ trong signUpschema có type của username là string => signUpFormValues có kiểu username là string)

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();
  // useForm là hook giúp ta lấy dữ liệu input, kiểm tra dữ liệu hợp lệ không rồi tới gửi form
  // zod kiểm tra dữ liệu
  // hook form kiểm tra trạng thái, sự kiện của form

  // register : hàm theo dõi giá trị của ô input
  // handleSubmit : hàm sẽ chạy khi người dùng bấm đăng kí
  // errors : chứa lỗi khi input không hợp lệ
  // isSubmitting : cho biết form khi nào form đang trong quá trình gửi dữ liệu
  // { resolver: zodResolver(signUpschema) } kết nói schema signUpschema
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInFormValues>({ resolver: zodResolver(signInschema) });

  const onSubmit = async (data: signInFormValues) => {
    const { username, password } = data;
    // goi Backend để signin
    await signIn(username, password);
    navigate("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col gap-2 items-center text-center">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>
                <h1 className="text-2xl font-bold">Chào mừng quay trở lại!</h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản của bạn
                </p>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block text-sm">
                  Tài khoản
                </Label>
                <Input
                  type="text"
                  id="username"
                  autoComplete="username"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block text-sm">
                  Mật khẩu
                </Label>
                <Input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
              {/* nút đăng nhập  */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Đăng Ký
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoảnh dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chính tôi.
      </div>
    </div>
  );
}
