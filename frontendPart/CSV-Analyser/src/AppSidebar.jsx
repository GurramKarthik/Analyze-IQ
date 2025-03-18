import { Calendar, Home, Inbox, Search, Settings, ChartPie, BotMessageSquare , FileChartColumnIncreasing  } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton,  SidebarMenuItem,} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "dashboard",
    icon: ChartPie,
  },
  {
    title: "Intracte",
    url: "chat",
    icon: BotMessageSquare,
  },
]





export default function AppSidebar() {
  const {user} = useSelector(store => store.user)
  const files = user.files
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {files.map((item) => (
                <SidebarMenuItem key={item.filename}>
                  <SidebarMenuButton asChild>
                    <Link to={"files"} state={{ url: item.url }} >
                      <FileChartColumnIncreasing />
                      <span>{item.filename}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

