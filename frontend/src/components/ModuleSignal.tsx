import { useId } from "react";
import { ArrowUpRight, Cpu, Database, Layers3, Sparkles } from "lucide-react";

type Props = { label: string; core: string; nodes: [string,string,string]; footnote?: string };
export default function ModuleSignal({label,core,nodes,footnote="CONTEXTO / DISEÑO / POSIBILIDADES"}:Props) {
  const id = useId().replace(/:/g, "");
  return <div className="gs-module-signal" aria-hidden="true"><div className="gs-module-signal-head"><span><i/>{label}</span><ArrowUpRight size={15}/></div><svg viewBox="0 0 480 360" fill="none"><defs><linearGradient id={id} x1="40" y1="0" x2="440" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#77d9ff"/><stop offset="1" stopColor="#457bff"/></linearGradient></defs><g stroke={`url(#${id})`} strokeWidth=".65" opacity=".5">{Array.from({length:12},(_,i)=><ellipse key={i} cx="240" cy="180" rx={45+i*9} ry="115" transform={`rotate(${i*15} 240 180)`}/>)}</g><path d="M45 65H130L240 180 350 65H435M40 290H130L240 180 350 290H440" stroke={`url(#${id})`} strokeDasharray="3 6" opacity=".6"/></svg><div className="gs-module-signal-core"><Cpu size={24}/><strong>{core}</strong><small>GIOVSOFT</small></div><div className="gs-module-signal-node signal-node-one"><Database size={14}/>{nodes[0]}</div><div className="gs-module-signal-node signal-node-two"><Layers3 size={14}/>{nodes[1]}</div><div className="gs-module-signal-node signal-node-three"><Sparkles size={14}/>{nodes[2]}</div><span className="gs-module-signal-foot">{footnote}</span></div>;
}
