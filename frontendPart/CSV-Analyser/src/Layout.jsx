import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { ModeToggle } from "./components/Home/Dark"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import LoginTrigger from "./components/Auth/LoginTrigger"
  
  export default function Layout({children}) {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[100vh] max-w-md rounded-lg border md:min-w-[98.5vw]"
      >
        <ResizablePanel defaultSize={15}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="h-full">
                <div className="NavBar">
                        <ModeToggle/>
                        <LoginTrigger/>

                </div>
                {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  