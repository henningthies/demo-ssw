import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePositions, useTrades } from "@/hooks/useTrades"
import { TrendingUp, TrendingDown, Activity, Wallet } from "lucide-react"

export function DashboardPage() {
  const { data: positions, isLoading: posLoading } = usePositions()
  const { data: trades, isLoading: tradesLoading } = useTrades()

  if (posLoading || tradesLoading) return <div>Loading...</div>

  const totalPnl = positions?.reduce((sum, p) => sum + p.pnl, 0) ?? 0
  const openTrades = trades?.filter((t) => t.status === "OPEN").length ?? 0
  const totalExposure = positions?.reduce((sum, p) => sum + p.quantity * p.currentPrice, 0) ?? 0

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            {totalPnl >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalPnl >= 0 ? "+" : ""}
              {totalPnl.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </div>
            <p className="text-xs text-muted-foreground">Unrealized P&L across all positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Trades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTrades}</div>
            <p className="text-xs text-muted-foreground">Pending execution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active instruments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exposure</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExposure.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </div>
            <p className="text-xs text-muted-foreground">Total market value</p>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions?.map((pos) => (
                <TableRow key={pos.symbol}>
                  <TableCell className="font-medium">{pos.symbol}</TableCell>
                  <TableCell className="text-right">{pos.quantity}</TableCell>
                  <TableCell className="text-right">${pos.avgPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${pos.currentPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={pos.pnl >= 0 ? "default" : "destructive"}>
                      {pos.pnl >= 0 ? "+" : ""}${pos.pnl.toFixed(2)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades?.slice(0, 5).map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(trade.createdAt).toLocaleDateString("de-DE")}
                  </TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={trade.type === "BUY" ? "default" : "secondary"}>
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{trade.quantity}</TableCell>
                  <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
