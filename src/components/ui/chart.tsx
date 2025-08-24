import * as React from "react"
import { useEffect, useState } from 'react';
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: Record<string, any>[];
  xAxis?: string;
  yAxis?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  className?: string;
}

interface LiveChartProps {
  title: string;
  method: string;
  dataKey: string;
  color?: string;
}

export function LiveChart({ title, method, dataKey, color = "#8884d8" }: LiveChartProps) {
  const [data, setData] = useState<Array<{ timestamp: number; value: number }>>([]);
  const rpcEndpoint = "https://36c4832f2e9b.ngrok-free.app";
  const corsProxy = "https://corsproxy.io/?";

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching ${method} from ${rpcEndpoint}...`);
        const response = await fetch(corsProxy + encodeURIComponent(rpcEndpoint), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: ['latest'],
            id: 1
          })
        });
        
        if (!response.ok) {
          console.error('RPC request failed:', response.status, response.statusText);
          const text = await response.text();
          console.error('Response text:', text);
          return;
        }

        const result = await response.json();
        console.log(`${method} response:`, result);
        
        const now = Date.now();
        
        let value = 0;
        if (method === 'starknet_getBlockWithTxs') {
          if (result.result?.transactions) {
            value = result.result.transactions.length;
            console.log('Transaction count:', value);
          } else {
            console.warn('No transactions found in response');
          }
        } else if (method === 'starknet_getStateUpdate') {
          if (result.result?.state_diff?.storage_diffs) {
            value = result.result.state_diff.storage_diffs.length;
            console.log('Storage diffs count:', value);
          } else if (result.result?.state_diff) {
            value = Object.keys(result.result.state_diff).length;
            console.log('State diff changes:', value);
          } else {
            console.warn('No state diffs found in response');
          }
        }

        setData(prev => {
          const newData = [...prev.slice(-30), { timestamp: now, value }];
          console.log('New data point:', { timestamp: now, value });
          console.log('Chart data:', newData);
          return newData;
        });
      } catch (error) {
        console.error('RPC call failed:', error);
      }
    };

    // Initial fetch
    fetchData();
    
    // Update every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [method]);

  return (
    <div className="w-full p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-[300px]">
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          <RechartsPrimitive.LineChart data={data}>
            <RechartsPrimitive.XAxis 
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
            />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              formatter={(value: number) => [value, title]}
            />
            <RechartsPrimitive.Line 
              type="monotone"
              dataKey="value"
              stroke={color}
              dot={false}
              strokeWidth={2}
            />
          </RechartsPrimitive.LineChart>
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChartComponent({ type, data, xAxis, yAxis, aggregation = 'sum', className }: ChartProps) {
  // Process data based on aggregation if needed
  const processedData = React.useMemo(() => {
    if (!xAxis || !yAxis || !data.length) return data;

    const groupedData = data.reduce((acc, row) => {
      const key = row[xAxis];
      if (!acc[key]) {
        acc[key] = [];
      }
      if (typeof row[yAxis] === 'number') {
        acc[key].push(row[yAxis]);
      } else {
        const num = Number(row[yAxis]);
        if (!isNaN(num)) {
          acc[key].push(num);
        }
      }
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(groupedData).map(([key, values]) => {
      let value: number;
      switch (aggregation) {
        case 'sum':
          value = values.reduce((sum, v) => sum + v, 0);
          break;
        case 'avg':
          value = values.reduce((sum, v) => sum + v, 0) / values.length;
          break;
        case 'count':
          value = values.length;
          break;
        case 'min':
          value = Math.min(...values);
          break;
        case 'max':
          value = Math.max(...values);
          break;
        default:
          value = values[0] ?? 0;
      }
      return { [xAxis]: key, [yAxis]: value };
    });
  }, [data, xAxis, yAxis, aggregation]);

  // Render appropriate chart type
  const renderChart = () => {
    const config = {
      data: processedData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    switch (type) {
      case 'bar':
        return (
          <RechartsPrimitive.BarChart {...config}>
            <RechartsPrimitive.XAxis dataKey={xAxis} />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Bar dataKey={yAxis} fill="#8884d8" />
          </RechartsPrimitive.BarChart>
        );
      case 'line':
        return (
          <RechartsPrimitive.LineChart {...config}>
            <RechartsPrimitive.XAxis dataKey={xAxis} />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </RechartsPrimitive.LineChart>
        );
      case 'pie':
        return (
          <RechartsPrimitive.PieChart {...config}>
            <RechartsPrimitive.Pie 
              data={processedData} 
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              fill="#8884d8" 
              label
            />
            <RechartsPrimitive.Tooltip />
          </RechartsPrimitive.PieChart>
        );
      case 'area':
        return (
          <RechartsPrimitive.AreaChart {...config}>
            <RechartsPrimitive.XAxis dataKey={xAxis} />
            <RechartsPrimitive.YAxis />
            <RechartsPrimitive.Tooltip />
            <RechartsPrimitive.Area type="monotone" dataKey={yAxis} fill="#8884d8" stroke="#8884d8" />
          </RechartsPrimitive.AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
}

export { ChartComponent as Chart }

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
