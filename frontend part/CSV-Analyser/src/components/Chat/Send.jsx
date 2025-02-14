import { AnimatedSubscribeButton } from "../magicui/animated-subscribe-button";
import { CheckIcon, ChevronRightIcon, Send } from "lucide-react";

export default function SendBtn({handleSend}) {
  return (
    <AnimatedSubscribeButton onClick={handleSend} className="w-[20%] rounded relative right-0">
      <span className="group inline-flex items-center">
          <p className="mr-1">Send</p>
          <Send color="#080808" />
      </span>
      <span className="group inline-flex items-center">
         <CheckIcon className="mr-2 size-4" />
         <p className="ml-1">Responding</p>
      </span>
    </AnimatedSubscribeButton>
  );
}
