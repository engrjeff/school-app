/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { Canvas, FabricImage, FabricObject, Line, Rect, Textbox } from "fabric"
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  DownloadIcon,
  ImageIcon,
  MinusIcon,
  PlusIcon,
  SaveIcon,
  SettingsIcon,
  ShapesIcon,
  TypeIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { DEFAULT_IMAGES, otherFonts, recommendedFonts } from "./constants"

const CANVAS_DIMENSIONS = { width: 842, height: 595, mobileMultiplier: 0.9 }
const DEFAULT_BACKGROUND_COLOR = "#ffffff"
const DEFAULT_FONT_COLOR = "#000000"
const DEFAULT_SELECTED_BORDER = "#8a4fec"
const DEFAULT_FONT_FAMILY = "Times New Roman"
const DEFAULT_TEXT_OPTIONS = {
  text: "Your Text Here",
  fontFamily: DEFAULT_FONT_FAMILY,
  fill: DEFAULT_FONT_COLOR,
  textAlign: "center",
}

const MARGIN = 24

// Define types for our guidelines
type GuideLinePosition = {
  x?: number
  y?: number
  orientation: "horizontal" | "vertical"
}

// Define types for alignment points
type AlignmentPoint = {
  x: number
  y: number
  type: "center" | "edge"
}

declare module "fabric" {
  // to have the properties recognized on the instance and in the constructor
  interface FabricObject {
    id?: string
    name?: string
  }
  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    id?: string
    name?: string
  }
}

type ElementMenu = "image" | "shapes" | "text" | "presets"

type TextStyleDefaults =
  | "default"
  | "heading"
  | "subheading"
  | "body"
  | "cert-head"

export interface SelectedTextProps {
  fontFamily: string
  fontColor: string
  fontSize: number
  textAlign: string
  isTextSelected: boolean
}

export function CertificateBuilder() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)

  const fabricRef = React.useRef<Canvas | null>(null)

  const guidelinesRef = React.useRef<Line[]>([])

  const [elementMenu, setElementMenu] = React.useState<ElementMenu>("text")

  const [selectedTextProperties, setSelectedTextProperties] =
    React.useState<SelectedTextProps>({
      fontFamily: DEFAULT_FONT_FAMILY,
      fontColor: DEFAULT_FONT_COLOR,
      fontSize: 14,
      textAlign: "center",
      isTextSelected: false,
    })

  React.useEffect(() => {
    if (!canvasRef.current) return

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: CANVAS_DIMENSIONS.width,
      height: CANVAS_DIMENSIONS.height,
    })

    fabricRef.current = fabricCanvas

    fabricCanvas.backgroundColor = DEFAULT_BACKGROUND_COLOR

    setupAlignmentGuides(fabricCanvas)

    // margin line
    fabricCanvas.add(
      new Rect({
        top: MARGIN,
        left: MARGIN,
        width: CANVAS_DIMENSIONS.width - 2 * MARGIN,
        height: CANVAS_DIMENSIONS.height - 2 * MARGIN,
        fill: "transparent",
        excludeFromExport: true,
        selectable: false,
        evented: false,
        stroke: DEFAULT_SELECTED_BORDER,
        opacity: 0.2,
      })
    )

    fabricCanvas.on("object:added", (e) => {
      const object = e.target
      if (object) {
        object.set({
          cornerColor: "#FFF",
          cornerStyle: "circle",
          borderColor: DEFAULT_SELECTED_BORDER,
          borderScaleFactor: 1.5,
          transparentCorners: false,
          borderOpacityWhenMoving: 1,
          cornerStrokeColor: DEFAULT_SELECTED_BORDER,
        })

        fabricCanvas.renderAll()
      }
    })

    // Listen to multiple events that might change selection
    fabricCanvas.on("selection:created", updateSelectedProperties)
    fabricCanvas.on("selection:updated", updateSelectedProperties)
    fabricCanvas.on("selection:cleared", updateSelectedProperties)

    // Add a listener for object modifications
    fabricCanvas.on("object:modified", updateSelectedProperties)

    fabricCanvas.renderAll()

    // setup keyboard event handles
    function handleKeyboardEvent(e: KeyboardEvent) {
      if (!fabricRef.current) return

      const activeObject = fabricRef.current.getActiveObject()

      if (!activeObject) return

      if (activeObject.type === "textbox") {
        if ((activeObject as Textbox).isEditing) {
          return
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.code === "KeyD") {
        e.preventDefault()

        activeObject.clone().then((obj) => {
          obj.set("left", activeObject.left + 40)
          obj.set("top", activeObject.top - 40)
          fabricRef.current?.add(obj)
          fabricRef.current?.setActiveObject(obj)
        })
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        fabricRef.current.remove(activeObject)
        fabricRef.current.discardActiveObject()
        fabricRef.current.renderAll()
      }
    }

    document.addEventListener("keydown", handleKeyboardEvent)

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvent)

      fabricCanvas.off("selection:created", updateSelectedProperties)
      fabricCanvas.off("selection:updated", updateSelectedProperties)
      fabricCanvas.off("selection:cleared", updateSelectedProperties)
      fabricCanvas.off("object:modified", updateSelectedProperties)

      fabricCanvas.dispose()
    }
  }, [])

  React.useEffect(() => {
    if (!fabricRef.current) return

    fabricRef.current.set("alignmentLines", true)
    fabricRef.current.set("snapToGrid", true)

    fabricRef.current.renderAll()
  }, [])

  // Setup alignment guides and snapping
  const setupAlignmentGuides = (canvas: Canvas) => {
    // Threshold for alignment detection (in pixels)
    const alignmentThreshold = 2

    // Store active guidelines
    let activeGuideLines: GuideLinePosition[] = []

    // Create guideline objects (initially hidden)
    const createGuideLine = (position: GuideLinePosition): Line => {
      const { x, y, orientation } = position
      let line: Line

      if (orientation === "horizontal") {
        line = new Line([0, y!, canvas.width!, y!], {
          stroke: "#00aeef",
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          excludeFromExport: true,
          name: "guideline",
        })
      } else {
        line = new Line([x!, 0, x!, canvas.height!], {
          stroke: "#00aeef",
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          excludeFromExport: true,
          name: "guideline",
        })
      }

      return line
    }

    // Get alignment points for an object
    const getAlignmentPoints = (obj: FabricObject): AlignmentPoint[] => {
      const points: AlignmentPoint[] = []

      if (!obj.aCoords) return points

      // Center point
      points.push({
        x: obj.left! + obj.width! / 2,
        y: obj.top! + obj.height! / 2,
        type: "center",
      })

      // Edge points
      points.push({
        x: obj.left!,
        y: obj.top!,
        type: "edge",
      })

      points.push({
        x: obj.left! + obj.width!,
        y: obj.top!,
        type: "edge",
      })

      points.push({
        x: obj.left!,
        y: obj.top! + obj.height!,
        type: "edge",
      })

      points.push({
        x: obj.left! + obj.width!,
        y: obj.top! + obj.height!,
        type: "edge",
      })

      // Middle points
      points.push({
        x: obj.left!,
        y: obj.top! + obj.height! / 2,
        type: "edge",
      })

      points.push({
        x: obj.left! + obj.width!,
        y: obj.top! + obj.height! / 2,
        type: "edge",
      })

      points.push({
        x: obj.left! + obj.width! / 2,
        y: obj.top!,
        type: "edge",
      })

      points.push({
        x: obj.left! + obj.width! / 2,
        y: obj.top! + obj.height!,
        type: "edge",
      })

      return points
    }

    // Clear all guidelines
    const clearGuideLines = () => {
      canvas.getObjects().forEach((obj) => {
        if (obj.name === "guideline") {
          canvas.remove(obj)
        }
      })

      activeGuideLines = []
      guidelinesRef.current = []
    }

    // Show guidelines based on object position
    const showAlignmentGuides = (activeObj: FabricObject) => {
      clearGuideLines()

      // Skip if no active object
      if (!activeObj) return

      const activeObjPoints = getAlignmentPoints(activeObj)

      // Check alignment with other objects
      canvas.getObjects().forEach((obj) => {
        if (obj === activeObj || obj.name === "guideline") return

        const objPoints = getAlignmentPoints(obj)

        // Check for alignment between points
        activeObjPoints.forEach((activePoint) => {
          objPoints.forEach((point) => {
            // Horizontal alignment (y-axis)
            if (Math.abs(activePoint.y - point.y) < alignmentThreshold) {
              const guideLine: GuideLinePosition = {
                y: point.y,
                orientation: "horizontal",
              }

              // Check if we already have this guideline
              if (
                !activeGuideLines.some(
                  (gl) =>
                    gl.orientation === "horizontal" &&
                    Math.abs(gl.y! - point.y) < 2
                )
              ) {
                activeGuideLines.push(guideLine)

                // Snap the object to the guideline if snap is enabled
                const diff = point.y - activePoint.y
                activeObj.set("top", activeObj.top! + diff)
                canvas.requestRenderAll()

                // Create and add the guideline
                const line = createGuideLine(guideLine)
                canvas.add(line)
                guidelinesRef.current.push(line)
              }
            }

            // Vertical alignment (x-axis)
            if (Math.abs(activePoint.x - point.x) < alignmentThreshold) {
              const guideLine: GuideLinePosition = {
                x: point.x,
                orientation: "vertical",
              }

              // Check if we already have this guideline
              if (
                !activeGuideLines.some(
                  (gl) =>
                    gl.orientation === "vertical" &&
                    Math.abs(gl.x! - point.x) < 2
                )
              ) {
                activeGuideLines.push(guideLine)

                // Snap the object to the guideline if snap is enabled
                const diff = point.x - activePoint.x
                activeObj.set("left", activeObj.left! + diff)
                canvas.requestRenderAll()

                // Create and add the guideline
                const line = createGuideLine(guideLine)
                canvas.add(line)
                guidelinesRef.current.push(line)
              }
            }
          })
        })
      })

      canvas.renderAll()
    }

    // Event listeners
    canvas.on("object:moving", (e) => {
      if (e.target) {
        showAlignmentGuides(e.target)
      }
    })

    canvas.on("object:modified", () => {
      clearGuideLines()
    })

    canvas.on("selection:cleared", () => {
      clearGuideLines()
    })
  }

  // Add listeners for object selection and deselection
  const updateSelectedProperties = () => {
    if (!fabricRef.current) return

    const activeObject = fabricRef.current.getActiveObject()

    if (activeObject && activeObject.type === "textbox") {
      setSelectedTextProperties({
        fontFamily: activeObject.get("fontFamily") as string,
        fontColor: activeObject.get("fill") as string,
        fontSize: activeObject.get("fontSize") as number,
        textAlign: activeObject.get("textAlign") as string,
        isTextSelected: true,
      })
    } else {
      setSelectedTextProperties({
        fontFamily: DEFAULT_FONT_FAMILY,
        fontColor: DEFAULT_FONT_COLOR,
        fontSize: 14,
        textAlign: "center",
        isTextSelected: false,
      })
    }
  }

  async function addImage(imageSrc: string) {
    if (!fabricRef.current) return

    const img = await FabricImage.fromURL(imageSrc)

    if (!img) {
      toast.error("Failed to load image.")
      return
    }

    const { width, height } = fabricRef.current
    const scale = Math.min(
      (width * 0.15) / img.width!,
      (height * 0.15) / img.height!
    )

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: width / 4,
      top: height / 4,
      originX: "center",
      originY: "center",
      selectable: true,
    })

    fabricRef.current.add(img)
    fabricRef.current.setActiveObject(img)
    fabricRef.current.renderAll()
  }

  const handleTextOptionClick = (styleType: TextStyleDefaults) => {
    if (!fabricRef.current) return

    const { width, height } = fabricRef.current

    let text: Textbox | undefined = undefined

    switch (styleType) {
      case "default":
        text = new Textbox("Your text here", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: height / 4,
          fontSize: 20,
          width: width * 0.4,
        })

        break

      case "heading":
        text = new Textbox("Heading", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: height / 4,
          width: width * 0.4,
          fontSize: 36,
          fontWeight: 700,
        })

        break

      case "subheading":
        text = new Textbox("Subheading", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: height / 4,
          width: width * 0.4,
          fontSize: 24,
          fontWeight: 500,
        })

        break

      case "body":
        text = new Textbox("Body text", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: height / 4,
          width: width * 0.4,
          fontSize: 16,
        })

        break

      case "cert-head":
        const lineOne = new Textbox("Republic of the Philippines", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: 30,
          fontSize: 18,
          width: width / 2,
          fontFamily: "UnifrakturMaguntia",
        })

        const lineTwo = new Textbox("Department of Education", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: 50,
          fontSize: 32,
          width: width / 2,
          fontFamily: "UnifrakturMaguntia",
        })

        const lineThree = new Textbox("REGION IV-A - CALABARZON", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: 85,
          width: width / 2,
          fontSize: 12,
        })

        const lineFour = new Textbox("DIVISION OF RIZAL", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: 100,
          width: width / 2,
          fontSize: 12,
        })

        const lineFive = new Textbox("MORONG NATIONAL HIGH SCHOOL", {
          ...DEFAULT_TEXT_OPTIONS,
          left: width / 4,
          top: 114,
          width: width / 2,
          fontSize: 12,
        })

        const items = [lineOne, lineTwo, lineThree, lineFour, lineFive]

        // const group = new Group(items)

        // fabricRef.current.add(group)

        // fabricRef.current.setActiveObject(group)

        fabricRef.current.add(...items)

        fabricRef.current.renderAll()

        break
    }

    if (text && styleType !== "cert-head") {
      fabricRef.current.add(text)
      fabricRef.current.setActiveObject(text)
      fabricRef.current.renderAll()
    }
  }

  function changeFontFamily(fontFamily: string) {
    if (!fabricRef.current) return

    const activeObject = fabricRef.current.getActiveObject()

    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as Textbox
      text.set("fontFamily", fontFamily)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontFamily: fontFamily,
      }))

      fabricRef.current.renderAll()
    }
  }

  function changeTextAlignment(textAlign: string) {
    if (!fabricRef.current) return

    const activeObject = fabricRef.current.getActiveObject()

    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as Textbox
      text.set("textAlign", textAlign)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        textAlign,
      }))

      fabricRef.current.renderAll()
    }
  }

  function changeFontSize(fontSize: number) {
    if (!fabricRef.current) return

    const activeObject = fabricRef.current.getActiveObject()

    if (activeObject && activeObject.type === "textbox") {
      const text = activeObject as Textbox
      text.set("fontSize", fontSize)

      // Immediately update the selected text properties
      setSelectedTextProperties((prev) => ({
        ...prev,
        fontSize,
      }))

      fabricRef.current.renderAll()
    }
  }

  return (
    <div className="flex min-h-screen items-start">
      {/* elements */}
      <div className="flex h-full flex-col items-start gap-2 border-r p-4">
        <button
          type="button"
          className={cn(
            "hover:bg-accent/60 hover:border-border inline-flex size-14 flex-col items-center justify-center gap-1 rounded-md border border-transparent bg-transparent p-1.5",
            elementMenu === "image"
              ? "text-primary border-border bg-accent/60"
              : ""
          )}
          onClick={() => setElementMenu("image")}
        >
          <ImageIcon className="size-5" />
          <span className="text-xs font-semibold">Images</span>
        </button>
        <button
          type="button"
          className={cn(
            "hover:bg-accent/60 hover:border-border inline-flex size-14 flex-col items-center justify-center gap-1 rounded-md border border-transparent bg-transparent p-1.5",
            elementMenu === "shapes"
              ? "text-primary border-border bg-accent/60"
              : ""
          )}
          onClick={() => setElementMenu("shapes")}
        >
          <ShapesIcon className="size-5" />
          <span className="text-xs font-semibold">Shapes</span>
        </button>
        <button
          type="button"
          className={cn(
            "hover:bg-accent/60 hover:border-border inline-flex size-14 flex-col items-center justify-center gap-1 rounded-md border border-transparent bg-transparent p-1.5",
            elementMenu === "text"
              ? "text-primary border-border bg-accent/60"
              : ""
          )}
          onClick={() => setElementMenu("text")}
        >
          <TypeIcon className="size-5" />
          <span className="text-xs font-semibold">Text</span>
        </button>
        <button
          type="button"
          className={cn(
            "hover:bg-accent/60 hover:border-border inline-flex size-14 flex-col items-center justify-center gap-1 rounded-md border border-transparent bg-transparent p-1.5",
            elementMenu === "presets"
              ? "text-primary border-border bg-accent/60"
              : ""
          )}
          onClick={() => setElementMenu("presets")}
        >
          <SettingsIcon className="size-5" />
          <span className="text-xs font-semibold">Presets</span>
        </button>
      </div>
      {/* active element's content */}
      <div className="h-full w-[250px] shrink-0 p-2">
        <div className="bg-accent/40 h-full rounded-md border">
          {elementMenu === "image" && (
            <>
              <div className="p-2">
                <p className="font-semibold">Images</p>
                <p className="text-muted-foreground text-xs">
                  Click an image to add to the editor.
                </p>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2 p-2">
                {DEFAULT_IMAGES.map((imagePath) => (
                  <button
                    key={imagePath}
                    type="button"
                    className="hover:bg-primary/20 rounded p-1"
                    onClick={() => addImage(imagePath)}
                  >
                    <img
                      src={imagePath}
                      alt=""
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
          {elementMenu === "shapes" && <div>Shapes</div>}
          {elementMenu === "text" && (
            <TextOptions onTextOptionClick={handleTextOptionClick} />
          )}
          {elementMenu === "presets" && <div>Presets</div>}
        </div>
      </div>
      {/* canvas & toolbar */}
      <div className="flex h-full flex-1 flex-col p-2">
        {/* toolbar */}
        <div className="flex items-center gap-2 rounded-lg border p-1">
          <TooltipProvider>
            {selectedTextProperties.isTextSelected && (
              <>
                <FontFamilyOptions
                  key={selectedTextProperties.fontFamily}
                  currentFontFamily={selectedTextProperties.fontFamily}
                  onChangeFontFamily={changeFontFamily}
                />
                <FontSizeOptions
                  key={selectedTextProperties.fontSize.toString()}
                  currentFontSize={selectedTextProperties.fontSize}
                  onFontSizeChange={changeFontSize}
                />
                <TextAlignmentToggle
                  key={selectedTextProperties.textAlign}
                  currentAlignment={selectedTextProperties.textAlign}
                  onTextAlignChange={changeTextAlignment}
                />
              </>
            )}
          </TooltipProvider>
          <div className="ml-auto space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" size="sm" variant="secondaryOutline">
                  <DownloadIcon /> Export <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>As Image</DropdownMenuItem>
                <DropdownMenuItem>As PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" size="sm">
              <SaveIcon /> Save as Template
            </Button>
          </div>
        </div>

        {/* canvas */}
        <div className="flex flex-1 items-start justify-center py-3">
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  )
}

function TextAlignmentToggle({
  currentAlignment,
  onTextAlignChange,
}: {
  currentAlignment: string
  onTextAlignChange: (textAlign: string) => void
}) {
  const alignments = ["left", "center", "right", "justify"]

  const [alignmentIndex, setAlignmentIndex] = React.useState(() =>
    alignments.indexOf(currentAlignment)
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="iconXs"
          variant="ghost"
          aria-label="Toggle alignment"
          onClick={() => {
            setAlignmentIndex((a) => (a + 1) % 4)

            onTextAlignChange(alignments[(alignmentIndex + 1) % 4])
          }}
        >
          {alignmentIndex === 0 && <AlignLeftIcon className="size-6" />}
          {alignmentIndex === 1 && <AlignCenterIcon className="size-6" />}
          {alignmentIndex === 2 && <AlignRightIcon className="size-6" />}
          {alignmentIndex === 3 && <AlignJustifyIcon className="size-6" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-foreground text-background" sideOffset={5}>
        <p>Alignment</p>
      </TooltipContent>
    </Tooltip>
  )
}

function TextOptions({
  onTextOptionClick,
}: {
  onTextOptionClick: (type: TextStyleDefaults) => void
}) {
  return (
    <ScrollArea>
      <div className="p-2">
        <p className="font-semibold">Text</p>
        <p className="text-muted-foreground text-xs">
          Click to add to the editor.
        </p>
      </div>
      <Separator />
      <div className="space-y-4 p-2">
        <Button className="w-full" onClick={() => onTextOptionClick("default")}>
          Add a text box
        </Button>

        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">Sample text styles</p>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onTextOptionClick("heading")}
          >
            <span className="text-lg font-bold">Heading</span>
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onTextOptionClick("subheading")}
          >
            <span className="font-semibold">Subheading</span>
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onTextOptionClick("body")}
          >
            <span className="text-sm">Body text</span>
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onTextOptionClick("cert-head")}
          >
            <span
              className="text-sm"
              style={{
                fontFamily: `'UnifrakturMaguntia', sans-serif`,
              }}
            >
              Republic of the Philippines
            </span>
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}

function FontFamilyOptions({
  currentFontFamily,
  onChangeFontFamily,
}: {
  currentFontFamily: string
  onChangeFontFamily: (fontName: string) => void
}) {
  const [value, setValue] = React.useState<string>(currentFontFamily)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondaryOutline"
          role="combobox"
          size="sm"
          className="w-[150px] justify-between"
        >
          {value ? (
            <span
              style={{
                fontFamily: `'${value}', sans-serif`,
              }}
            >
              {recommendedFonts
                .concat(otherFonts)
                .find((fontName) => fontName === value)}
            </span>
          ) : (
            "Font family"
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[190px] p-0">
        <Command>
          <CommandInput placeholder="Search font family" className="h-9" />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            <CommandGroup heading="Recommended">
              {recommendedFonts.map((fontName) => (
                <CommandItem
                  key={fontName}
                  value={fontName}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onChangeFontFamily(currentValue)
                  }}
                >
                  <span
                    style={{
                      fontFamily: `'${fontName}', sans-serif`,
                    }}
                  >
                    {fontName}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === fontName ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Others">
              {otherFonts.map((fontName) => (
                <CommandItem
                  key={fontName}
                  value={fontName}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onChangeFontFamily(currentValue)
                  }}
                >
                  <span
                    style={{
                      fontFamily: `'${fontName}', sans-serif`,
                    }}
                  >
                    {fontName}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === fontName ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function FontSizeOptions({
  currentFontSize,
  onFontSizeChange,
}: {
  currentFontSize: number
  onFontSizeChange: (fontSize: number) => void
}) {
  const min = 5
  return (
    <div className="bg-accent/60 flex h-8 items-center overflow-hidden rounded-md border">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="iconXs"
            variant="ghost"
            aria-label="Decrease font size"
            className="rounded-none"
            onClick={() => onFontSizeChange(Math.max(currentFontSize - 1, min))}
          >
            <MinusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-foreground text-background"
          sideOffset={5}
        >
          <p>Decrease font size</p>
        </TooltipContent>
      </Tooltip>
      <Input
        min={min}
        defaultValue={currentFontSize}
        readOnly
        className="hover:bg-secondary h-full w-14 rounded-none border-none text-center focus-visible:border-transparent focus-visible:ring-0"
        // onInput={(e) =>
        //   (e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ""))
        // }
        // onChange={(e) => {
        //   if (e.currentTarget.valueAsNumber < 5) {
        //     e.preventDefault()
        //     return
        //   }

        //   if (isNaN(e.currentTarget.valueAsNumber)) {
        //     e.preventDefault()
        //     return
        //   }

        //   onFontSizeChange(e.currentTarget.valueAsNumber)
        // }}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="iconXs"
            variant="ghost"
            aria-label="Increase font size"
            className="rounded-none"
            onClick={() => onFontSizeChange(currentFontSize + 1)}
          >
            <PlusIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="bg-foreground text-background"
          sideOffset={5}
        >
          <p>Increase font size</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
