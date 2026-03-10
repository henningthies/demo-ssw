import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { useCreateTrade } from "@/hooks/useTrades"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"

const legSchema = z.object({
  symbol: z.string().min(1, "Symbol required"),
  quantity: z.number({ error: "Must be a number" }).min(1, "Min 1"),
  price: z.number({ error: "Must be a number" }).positive("Must be positive"),
})

const tradeFormSchema = z
  .object({
    type: z.enum(["BUY", "SELL"]),
    legs: z.array(legSchema).min(1, "At least one leg required"),
    notes: z.string().optional(),
    reason: z.string().optional(),
  })
  .refine((data) => data.type !== "SELL" || (data.reason && data.reason.length > 0), {
    message: "Reason required for SELL orders",
    path: ["reason"],
  })

type TradeFormValues = z.infer<typeof tradeFormSchema>

export function TradeForm() {
  const navigate = useNavigate()
  const createTrade = useCreateTrade()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      type: "BUY",
      legs: [{ symbol: "", quantity: 0, price: 0 }],
      notes: "",
      reason: "",
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "legs" })
  // eslint-disable-next-line react-hooks/incompatible-library
  const tradeType = watch("type")
  const legs = watch("legs")

  const totalNotional = legs.reduce((sum, leg) => sum + (leg.quantity || 0) * (leg.price || 0), 0)

  async function onSubmit(data: TradeFormValues) {
    try {
      for (const leg of data.legs) {
        await createTrade.mutateAsync({
          symbol: leg.symbol,
          quantity: leg.quantity,
          price: leg.price,
          type: data.type,
          notes: data.notes,
        })
      }
      navigate("/trades")
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { errors?: Array<{ field: string; message: string }> } }
      }
      if (error.response?.status === 422) {
        error.response.data?.errors?.forEach((e) => {
          setError(e.field as keyof TradeFormValues, { message: e.message })
        })
      }
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Trade</h1>
        <p className="text-muted-foreground">Enter trade details and submit for execution.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Trade Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Side</Label>
              <Select
                value={tradeType}
                onValueChange={(val) => setValue("type", val as "BUY" | "SELL")}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tradeType === "SELL" && (
              <div className="grid gap-2">
                <Label>
                  Sell Reason <span className="text-destructive">*</span>
                </Label>
                <Input {...register("reason")} placeholder="Why are you selling?" />
                {errors.reason && (
                  <p className="text-sm text-destructive">{errors.reason.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Legs</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ symbol: "", quantity: 0, price: 0 })}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Leg
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.legs?.root && (
              <p className="text-sm text-destructive">{errors.legs.root.message}</p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_120px_140px_40px] gap-3 items-start"
              >
                <div className="grid gap-1.5">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Symbol</Label>
                  )}
                  <Input
                    {...register(`legs.${index}.symbol`)}
                    placeholder="e.g. AAPL"
                    className="font-mono"
                  />
                  {errors.legs?.[index]?.symbol && (
                    <p className="text-xs text-destructive">
                      {errors.legs[index].symbol.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Quantity</Label>
                  )}
                  <Input
                    {...register(`legs.${index}.quantity`, { valueAsNumber: true })}
                    type="number"
                    placeholder="Qty"
                    className="font-mono"
                  />
                  {errors.legs?.[index]?.quantity && (
                    <p className="text-xs text-destructive">
                      {errors.legs[index].quantity.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  {index === 0 && (
                    <Label className="text-xs text-muted-foreground">Price</Label>
                  )}
                  <Input
                    {...register(`legs.${index}.price`, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="font-mono"
                  />
                  {errors.legs?.[index]?.price && (
                    <p className="text-xs text-destructive">
                      {errors.legs[index].price.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  {index === 0 && <Label className="text-xs text-transparent">X</Label>}
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {/* Order Summary */}
            {totalNotional > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {legs.length} leg{legs.length > 1 ? "s" : ""}
                </span>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Total Notional</div>
                  <div className="text-lg font-bold font-mono">
                    ${totalNotional.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register("notes")}
              rows={3}
              placeholder="Optional trade notes, rationale, or references..."
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={createTrade.isPending}>
            {createTrade.isPending ? "Submitting..." : "Submit Trade"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/trades")}>
            Cancel
          </Button>
          {totalNotional > 0 && (
            <Badge variant="secondary" className="ml-auto text-sm">
              {tradeType} ${totalNotional.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Badge>
          )}
        </div>
      </form>
    </div>
  )
}
