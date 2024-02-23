"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { currentUserAtom } from "@/modules/JotaiProiveder"
import { IUser } from "@/modules/auth/types"
import { __DEV__ } from "@apollo/client/utilities/globals"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useAtomValue } from "jotai"
import {
  Archive,
  Bell,
  BellOff,
  LogOut,
  MoreVerticalIcon,
  Pin,
  PinOff,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import Image from "@/components/ui/image"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import useChatsMutation from "../hooks/useChatsMutation"
import LeaveChat from "./LeaveChat"

dayjs.extend(relativeTime)

export const ChatItem = ({
  chat,
  isPinned,
  notContactedUser,
  handleForward,
}: {
  chat?: any
  isPinned: boolean
  notContactedUser?: IUser
  handleForward?: (id: string, forwardType: string) => void
}) => {
  const router = useRouter()
  const currentUser = useAtomValue(currentUserAtom) || ({} as IUser)

  const callBack = (result: string) => {
    if (result === "success") {
      setOpen(false)
    }
  }

  const { togglePinned, toggleMute, chatArchive } = useChatsMutation({
    callBack,
  })
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [showActionBtn, setShowActionBtn] = useState(false)

  const chatId = searchParams.get("id")

  const isSeen = chat && chat.isSeen ? chat.isSeen : false

  const users: any[] = chat?.participantUsers || []
  const user: any =
    users?.length > 1
      ? users?.filter((u) => u._id !== currentUser?._id)[0]
      : users?.[0]

  const handleClick = () => {
    if (chat) {
      router.push(`/chats/detail?id=${chat._id}`)
    }
  }

  const onPin = () => {
    togglePinned(chat._id)
  }

  const onMute = () => {
    toggleMute(chat._id)
  }

  const renderChatActions = () => {
    const renderDelete = () => {
      if (chat.type === "group") {
        return (
          <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild={true}>
              <div className="hover:bg-[#F0F0F0] p-2 rounded-md cursor-pointer text-rose-600 text-xs flex">
                <LogOut size={14} />
                &nbsp; Leave Chat
              </div>
            </DialogTrigger>

            {open ? <LeaveChat setOpen={setOpen} _id={chat._id} /> : null}
          </Dialog>
        )
      }

      return (
        <div
          className="hover:bg-[#F0F0F0] p-2 rounded-md cursor-pointer text-[#444] text-xs flex"
          onClick={() => chatArchive(chat._id)}
        >
          <Archive size={14} />
          &nbsp; Archive chat
        </div>
      )
    }

    return (
      <Popover>
        <PopoverTrigger asChild={true}>
          <div className="shrink-0 bg-[#F2F4F7] p-1 rounded-full border border-shq ml-auto">
            <MoreVerticalIcon size={16} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-3" align="start">
          <div
            className="hover:bg-[#F0F0F0] p-2 rounded-md cursor-pointer text-[#444] text-xs flex"
            onClick={onPin}
          >
            {isPinned ? <PinOff size={14} /> : <Pin size={14} />}&nbsp;
            {isPinned ? "Unpin" : "Pin"}
          </div>
          <div
            className="hover:bg-[#F0F0F0] p-2 rounded-md cursor-pointer text-[#444] text-xs flex"
            onClick={onMute}
          >
            {chat.muteUserIds.includes(currentUser._id) ? (
              <Bell size={14} />
            ) : (
              <BellOff size={14} />
            )}
            &nbsp;
            {chat.muteUserIds.includes(currentUser._id)
              ? "Unmute notification"
              : "Mute notification"}
          </div>

          {renderDelete()}
        </PopoverContent>
      </Popover>
    )
  }

  const renderForwardAction = () => {
    if (chat && handleForward) {
      return (
        <button
          className="rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5532c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            handleForward(
              chat.type === "group" ? chat._id : user._id,
              chat.type
            )
          }}
        >
          Send
        </button>
      )
    }

    if (handleForward && notContactedUser) {
      return (
        <button
          className="rounded-md bg-primary-light px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5532c7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => {
            handleForward(notContactedUser._id, "direct")
          }}
        >
          Send
        </button>
      )
    }

    return null
  }

  const renderAvatar = () => {
    if (chat) {
      return (
        <Image
          src={
            (chat.type === "direct"
              ? user && user.details?.avatar
              : chat && chat.featuredImage[0]?.url) || "/avatar-colored.svg"
          }
          alt="avatar"
          width={60}
          height={60}
          className="w-12 h-12 rounded-full object-cover"
        />
      )
    }

    return (
      <Image
        src={
          (notContactedUser &&
            notContactedUser.details &&
            notContactedUser.details.avatar) ||
          "/avatar-colored.svg"
        }
        alt="avatar"
        width={60}
        height={60}
        className="w-12 h-12 rounded-full object-cover"
      />
    )
  }

  const renderName = () => {
    if (chat) {
      return chat.type === "direct" ? (
        <>{user?.details.fullName || user?.email}</>
      ) : (
        chat?.name
      )
    }

    return notContactedUser?.details.fullName || notContactedUser?.email
  }

  const renderInfo = () => {
    if (notContactedUser) {
      return (
        <div className={`text-sm text-[#444] w-9/12`}>
          <p className="w-4/5 truncate">{renderName()}</p>
          <p className="w-1/2 truncate">
            {notContactedUser?.details.position ? (
              <span className="text-[10px]">
                {" "}
                ({notContactedUser?.details.position})
              </span>
            ) : null}
          </p>
        </div>
      )
    }

    return (
      <div
        className={`text-sm text-[#444] ${
          showActionBtn ? "w-[calc(100%-90px)]" : "w-[calc(100%-60px)]"
        }`}
      >
        <div className="flex justify-between">
          <p className="w-[calc(100%-14px)] text-[16px] truncate font-bold flex">
            {!handleForward && isPinned && (
              <Pin size={16} color="#6A45E6" className="shrink-0" />
            )}
            <span className="w-1/2 truncate">{renderName()}</span>
            <span className="w-1/2 truncate text-sm">
              {chat.type === "direct" && user?.details.position && (
                <>
                  <span className="text-[18px] text-black">&nbsp;∙&nbsp;</span>
                  <span className="font-normal">{user?.details.position}</span>
                </>
              )}
            </span>
          </p>
          {!handleForward &&
            chat &&
            chat.muteUserIds.includes(currentUser._id) && <BellOff size={14} />}
        </div>
        {!handleForward && (
          <div className="flex justify-between w-full text-sm text-[#667085]">
            <p
              className="truncate max-w-[150px]"
              dangerouslySetInnerHTML={{
                __html:
                  (chat?.lastMessage &&
                    (chat?.lastMessage.content === ""
                      ? "Media message"
                      : chat?.lastMessage.content)) ||
                  "",
              }}
            />
            <p>
              {chat.lastMessage &&
                chat.lastMessage.createdAt &&
                dayjs(chat.lastMessage.createdAt).fromNow(true)}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      className={`${
        !handleForward && chatId === chat._id
          ? "bg-[#F2F4F7] border border-shq"
          : "bg-transparent"
      } px-3 rounded-none py-4 cursor-pointer flex items-center shadow-none border-none mb-3 relative`}
      onClick={handleClick}
      onMouseEnter={() => setShowActionBtn(true)}
      onMouseLeave={() => setShowActionBtn(false)}
    >
      <div className="items-end flex mr-3">
        <div className="w-12 h-12 rounded-full relative">
          {renderAvatar()}
          <div className="indicator bg-success-foreground w-3 h-3 rounded-full border border-white mr-1 absolute bottom-0 right-0" />
        </div>
      </div>

      {renderInfo()}

      {!handleForward && showActionBtn && renderChatActions()}
      {handleForward && renderForwardAction()}

      {!isSeen && (
        <span className="rounded-full bg-primary absolute top-[10px] right-[10px] w-2.5 h-2.5">
          &nbsp;
        </span>
      )}
    </Card>
  )
}
