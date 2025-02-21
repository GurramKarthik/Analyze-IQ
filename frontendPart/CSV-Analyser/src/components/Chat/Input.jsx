import React from 'react'
import { Input } from "@/components/ui/input"
import { BorderBeam } from '../magicui/border-beam'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


const ChatInput = ({newMessage}) => {
  return (
    <div className='relative grow w-[70%] rounded'>
        <Textarea ref={newMessage} placeholder="Type your message here." id="message" />
        <BorderBeam duration={8} size={200}/>
    </div>
  )
}

export default ChatInput