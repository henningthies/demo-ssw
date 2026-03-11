import { Link } from "react-router-dom"
import { useTrades, useCancelTrade } from "@/hooks/useTrades"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { ExportPopover } from "@/components/ExportPopover"

export function TradesPage() {
  const { data: trades, isLoading } = useTrades()
  const cancelTrade = useCancelTrade()
  const [cancelId, setCancelId] = useState<string | null>(null)

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trade Blotter</h1>
          <p className="text-muted-foreground">All trades across desks and instruments.</p>
        </div>
        <div className="flex gap-2">
          {trades && <ExportPopover trades={trades} />}
          <Button asChild>
            <Link to="/trades/new">
              <Plus className="mr-2 h-4 w-4" /> New Trade
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Notional</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades?.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{trade.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(trade.createdAt).toLocaleDateString("de-DE")}{" "}
                    <span className="text-xs">
                      {new Date(trade.createdAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === "BUY" ? "default" : "destructive"}>
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {trade.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${trade.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${(trade.quantity * trade.price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        trade.status === "FILLED"
                          ? "default"
                          : trade.status === "OPEN"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {trade.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {trade.status === "OPEN" && (
                      <Dialog
                        open={cancelId === trade.id}
                        onOpenChange={(open) => setCancelId(open ? trade.id : null)}
                      >
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Trade #{trade.id}?</DialogTitle>
                            <DialogDescription>
                              This will cancel the {trade.type} order for {trade.quantity}x{" "}
                              {trade.symbol} at ${trade.price.toFixed(2)}.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setCancelId(null)}>
                              Keep
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                cancelTrade.mutate(trade.id)
                                setCancelId(null)
                              }}
                            >
                              Cancel Trade
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
