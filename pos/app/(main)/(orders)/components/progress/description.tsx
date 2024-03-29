import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Description = ({ description }: { description?: string }) => {
  if ((description || "").length < 30) return <p>{description}</p>
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p>{(description || "").slice(0, 30) + "..."}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-md">{description || ""}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Description
