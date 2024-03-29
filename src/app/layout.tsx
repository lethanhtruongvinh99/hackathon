// @ts-nocheck
"use client";
import BottomNavigation from "@/components/bottomNavigation";
import Header from "@/components/header";
import { EventContext } from "@/contexts/eventContext";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Inter } from "next/font/google";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DUMMY_DATA } from "../../dummyData";
import StyledComponentsRegistry from "../../lib/AntdRegistry";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowNavigation, setShowNavigation] = useState(false);
  const [event, setEvent] = useState({});
  const router = useRouter();
  const pathname = usePathname();
  const queries = useSearchParams();

  const onClickFAQs = () => {
    router.push("/faqs");
  };

  useEffect(() => {
    // console.log(pathname, queries.get("eventcode"));
    if (!queries.get("eventcode") || !queries.get("guestemail")) {
      const storedData = JSON.parse(sessionStorage.getItem("allData"));
      if (!storedData?.eventcode || !storedData?.guestemail) {
        setShowNavigation(false);
        router.push("/");
      } else {
        if ((new Date()).valueOf() > new Date(storedData?.findData?.eventFinishTime).valueOf() ) {
          setShowNavigation(false);
          setEvent(storedData.findData);
          router.push("/feedback");
        } else {
          setShowNavigation(true);
          setEvent(storedData.findData);
          // router.push('/event-detail')
        }
      }
    } else {
      // if expired --> go to feedback page
      // else the code below
      const findData = DUMMY_DATA.find(event => event.eventCode === queries.get("eventcode"));
      sessionStorage.setItem(
        "allData",
        JSON.stringify({
          eventcode: queries.get("eventcode"),
          guestemail: queries.get("guestemail"),
          findData,
        })
      );
      setShowNavigation(true);
      setEvent(findData);
      router.push('/event-detail')
    }
  }, [pathname, queries, router]);

  return (
    <html lang="en">
      <EventContext.Provider
        value={{ event, setEvent, isShowNavigation, setShowNavigation }}
      >
        <body className={inter.className}>
          <StyledComponentsRegistry>
            <Header />
            <main>{children}</main>
            {isShowNavigation ? (
              <>
                <Button
                  className="float-button"
                  type="primary"
                  size="large"
                  shape="circle"
                  icon={<QuestionCircleOutlined />}
                  onClick={onClickFAQs}
                />
                <BottomNavigation />
              </>
            ) : (
              <></>
            )}
          </StyledComponentsRegistry>
        </body>
      </EventContext.Provider>
    </html>
  );
}
