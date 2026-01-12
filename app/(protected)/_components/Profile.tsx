import LoginButton from "@/app/(public)/login/_components/LoginButton";

// 추후 프로필 사진, 클릭 시 마이페이지, 로그아웃 버튼 드롭다운
export default function Profile() {
  return <LoginButton isAuthenticated />;
}
