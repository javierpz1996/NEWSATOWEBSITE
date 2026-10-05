import { getHomeIntroBlockingScriptContent } from "@/lib/home-intro-blocking-script";

export function HomeIntroBlockingScript() {
  return (
    <script
      id="home-intro-boot"
      dangerouslySetInnerHTML={{ __html: getHomeIntroBlockingScriptContent() }}
    />
  );
}
