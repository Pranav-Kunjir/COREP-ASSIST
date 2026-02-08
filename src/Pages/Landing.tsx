import { SignIn } from "../components/signIn";

export default function Landing() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-blue-500/30">
            {/* Navigation / Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <span className="font-semibold text-white tracking-tight">COREP ASSIST</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#problem" className="text-sm hover:text-white transition-colors">Problem</a>
                        <a href="#solution" className="text-sm hover:text-white transition-colors">Solution</a>
                        <a href="#workflow" className="text-sm hover:text-white transition-colors">Workflow</a>
                        <SignIn />
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Internal Prototype
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Compliance with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Context & Confidence</span>
                    </h1>
                    <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        An LLM-assisted regulatory reporting assistant for COREP Own Funds.
                        <br />
                        Designed for auditability, explainability, and analyst control.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <SignIn />
                        <a href="#architecture" className="px-6 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-white transition-all text-sm font-medium">
                            View System Architecture
                        </a>
                    </div>
                </div>

                {/* Abstract UI Mockup */}
                <div className="mt-16 max-w-5xl mx-auto rounded-xl border border-white/10 bg-neutral-900/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                    <div className="h-8 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                    </div>
                    <div className="p-8 grid grid-cols-12 gap-8 min-h-[400px]">
                        <div className="col-span-4 space-y-4">
                            <div className="h-4 w-3/4 bg-neutral-800 rounded"></div>
                            <div className="h-32 bg-neutral-800/50 rounded-lg border border-white/5 p-4">
                                <div className="h-3 w-full bg-neutral-700/50 rounded mb-2"></div>
                                <div className="h-3 w-5/6 bg-neutral-700/50 rounded mb-2"></div>
                                <div className="h-3 w-4/6 bg-neutral-700/50 rounded"></div>
                            </div>
                        </div>
                        <div className="col-span-8 bg-neutral-950 rounded-lg border border-white/5 p-6 relative">
                            <div className="absolute top-4 right-4 text-xs text-neutral-500 font-mono">C 01.00 - OWN FUNDS</div>
                            <div className="space-y-3 mt-8">
                                <div className="h-10 w-full bg-neutral-800/30 rounded border border-white/5 flex items-center px-4 justify-between">
                                    <div className="w-32 h-2 bg-neutral-700 rounded"></div>
                                    <div className="w-16 h-4 bg-emerald-900/30 border border-emerald-500/20 rounded"></div>
                                </div>
                                <div className="h-10 w-full bg-neutral-800/30 rounded border border-white/5 flex items-center px-4 justify-between">
                                    <div className="w-48 h-2 bg-neutral-700 rounded"></div>
                                    <div className="w-16 h-4 bg-neutral-800 border border-neutral-700 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem */}
            <section id="problem" className="py-24 px-6 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">The Regulatory Challenge</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Manual Complexity</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        COREP reporting requires navigating thousands of pages of Rulebook guidance, EBA ITS, and internal policies.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Interpretation Risk</h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        Inconsistent interpretation of row-level instructions can lead to reporting errors and audit findings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-neutral-950 rounded-2xl p-8 border border-white/5">
                        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-6">Current Workflow</h3>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex items-center gap-4 text-neutral-400">
                                <div className="w-8 text-center text-neutral-600">01</div>
                                <div className="flex-1 bg-neutral-900 p-3 rounded border border-neutral-800">Read PDF Instructions</div>
                            </div>
                            <div className="flex justify-center"><div className="w-0.5 h-4 bg-neutral-800"></div></div>
                            <div className="flex items-center gap-4 text-neutral-400">
                                <div className="w-8 text-center text-neutral-600">02</div>
                                <div className="flex-1 bg-neutral-900 p-3 rounded border border-neutral-800">Manually locate data sources</div>
                            </div>
                            <div className="flex justify-center"><div className="w-0.5 h-4 bg-neutral-800"></div></div>
                            <div className="flex items-center gap-4 text-neutral-400">
                                <div className="w-8 text-center text-neutral-600">03</div>
                                <div className="flex-1 bg-neutral-900 p-3 rounded border border-neutral-800">Input values & calculate totals</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Solution */}
            <section id="solution" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-white mb-4">A Decision-Support Engine</h2>
                        <p className="text-xl text-neutral-400">
                            Not automated compliance. <strong className="text-white font-medium">Augmented intelligence.</strong>
                            <br />
                            The system parses your scenario, retrieves relevant rules, and suggests row codes—leaving the final decision to you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Rule-Based Reasoning</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Connects unstructured scenario data to structured COREP template rows using retrieval-augmented generation.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-purple-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Human-in-the-Loop</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Every suggestion remains in 'Draft' status until explicitly accepted. Nothing adheres to the ledger without approval.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Full Audit Trail</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">
                                Tracks the "Why" behind every value. Captures reasoning, evidence, and change history for every cell.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* End-to-End Workflow */}
            <section id="workflow" className="py-24 px-6 bg-neutral-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">End-to-End Workflow</h2>
                        <p className="text-neutral-400 max-w-2xl">
                            From unstructured user input to a validated, audible report.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Flowchart Visualization */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="flex-1 bg-neutral-950 p-6 rounded-xl border border-neutral-800 relative w-full">
                                <div className="absolute -top-3 left-6 px-2 bg-neutral-950 text-xs font-mono text-blue-400 border border-blue-900/30 rounded">INPUT</div>
                                <h4 className="text-white font-medium mb-2">Analyst Input</h4>
                                <p className="text-xs text-neutral-500">"We issued 5M common shares..."</p>
                            </div>

                            <div className="hidden md:block text-neutral-600">→</div>
                            <div className="block md:hidden text-neutral-600 mx-auto">↓</div>

                            {/* Step 2 */}
                            <div className="flex-1 bg-neutral-950 p-6 rounded-xl border border-neutral-800 relative w-full">
                                <div className="absolute -top-3 left-6 px-2 bg-neutral-950 text-xs font-mono text-purple-400 border border-purple-900/30 rounded">PROCESS</div>
                                <h4 className="text-white font-medium mb-2">LLM Reasoning</h4>
                                <p className="text-xs text-neutral-500">Retrieves C 01.00 rules & matches Row 020</p>
                            </div>

                            <div className="hidden md:block text-neutral-600">→</div>
                            <div className="block md:hidden text-neutral-600 mx-auto">↓</div>

                            {/* Step 3 */}
                            <div className="flex-1 bg-neutral-950 p-6 rounded-xl border border-neutral-800 relative w-full">
                                <div className="absolute -top-3 left-6 px-2 bg-neutral-950 text-xs font-mono text-amber-400 border border-amber-900/30 rounded">REVIEW</div>
                                <h4 className="text-white font-medium mb-2">Suggestion</h4>
                                <p className="text-xs text-neutral-500">Row 020: 5,000,000 (Draft)</p>
                            </div>

                            <div className="hidden md:block text-neutral-600">→</div>
                            <div className="block md:hidden text-neutral-600 mx-auto">↓</div>

                            {/* Step 4 */}
                            <div className="flex-1 bg-neutral-950 p-6 rounded-xl border border-neutral-800 relative w-full">
                                <div className="absolute -top-3 left-6 px-2 bg-neutral-950 text-xs font-mono text-emerald-400 border border-emerald-900/30 rounded">LOG</div>
                                <h4 className="text-white font-medium mb-2">Audit</h4>
                                <p className="text-xs text-neutral-500">User Accepts -&gt; Locked & Logged</p>
                            </div>
                        </div>

                        {/* Connecting Line (Background) */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-800 -z-0 hidden md:block"></div>
                    </div>
                </div>
            </section>

            {/* AI Agent Architecture */}
            <section id="architecture" className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Agentic Architecture</h2>
                        <p className="text-neutral-400 mb-8 leading-relaxed">
                            The AI agent operates in controlled layers to ensure safety and determinism. It does not write directly to the database. Instead, it generates structured schema proposals that must pass validation before being presented to the user.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-xs text-neutral-400 font-mono">1</div>
                                <div>
                                    <h4 className="text-white font-medium">Context Ingestion</h4>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Combines the current template structure, existing row values, and the user's latest scenario description.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-xs text-neutral-400 font-mono">2</div>
                                <div>
                                    <h4 className="text-white font-medium">Validation Layer</h4>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        LLM outputs are parsed against a Zod schema. Hallucinated row codes or invalid formats are rejected instantly.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 w-6 h-6 rounded bg-neutral-800 flex items-center justify-center text-xs text-neutral-400 font-mono">3</div>
                                <div>
                                    <h4 className="text-white font-medium">Deterministic Calculation</h4>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Aggregations (e.g., Total Own Funds) are calculated effectively by code, not predicted by the LLM.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 flex items-center justify-center">
                        {/* Abstract System Diagram */}
                        <div className="relative w-full max-w-sm">
                            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl text-center mb-8">
                                <div className="text-blue-400 font-bold mb-1">LLM Reasoning</div>
                                <div className="text-xs text-blue-300/60">Instructions + Context</div>
                            </div>

                            <div className="w-0.5 h-8 bg-neutral-700 mx-auto"></div>
                            <div className="w-3 h-3 bg-neutral-700 mx-auto rotate-45 mb-1 -mt-2"></div>

                            <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-xl text-center my-2">
                                <div className="text-white font-mono text-sm">Structured JSON</div>
                            </div>

                            <div className="w-0.5 h-8 bg-neutral-700 mx-auto"></div>
                            <div className="w-3 h-3 bg-neutral-700 mx-auto rotate-45 mb-1 -mt-2"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl text-center">
                                    <div className="text-emerald-400 font-bold text-sm">Validation</div>
                                </div>
                                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-center">
                                    <div className="text-red-400 font-bold text-sm">Security</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Example Use Case */}
            <section className="py-24 px-6 bg-neutral-900/30 border-y border-white/5">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Example Use Case: Own Funds</h2>

                    <div className="space-y-4">
                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-lg shrink-0">1</div>
                                <div>
                                    <h3 className="text-white font-medium text-lg mb-2">Scenario</h3>
                                    <p className="text-neutral-400 italic">"Company Alpha has 10M in paid-up capital instruments and 2M in share premium accounts. Retained earnings are 5M."</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center text-neutral-600">↓</div>

                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">2</div>
                                <div className="w-full">
                                    <h3 className="text-white font-medium text-lg mb-4">Generated Suggestions</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-neutral-500 uppercase bg-neutral-900/50">
                                                <tr>
                                                    <th className="px-4 py-2">Row</th>
                                                    <th className="px-4 py-2">Item</th>
                                                    <th className="px-4 py-2 text-right">Amount</th>
                                                    <th className="px-4 py-2">Source</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-800">
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-neutral-300">020</td>
                                                    <td className="px-4 py-3 text-neutral-300">Paid-up capital instruments</td>
                                                    <td className="px-4 py-3 text-right font-mono text-emerald-400">10,000,000</td>
                                                    <td className="px-4 py-3 text-xs text-neutral-500">Scenario Input</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-neutral-300">030</td>
                                                    <td className="px-4 py-3 text-neutral-300">Share premium</td>
                                                    <td className="px-4 py-3 text-right font-mono text-emerald-400">2,000,000</td>
                                                    <td className="px-4 py-3 text-xs text-neutral-500">Scenario Input</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-neutral-300">130</td>
                                                    <td className="px-4 py-3 text-neutral-300">Retained earnings</td>
                                                    <td className="px-4 py-3 text-right font-mono text-emerald-400">5,000,000</td>
                                                    <td className="px-4 py-3 text-xs text-neutral-500">Scenario Input</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auditability */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl font-bold text-white mb-4">Auditability & Traceability</h2>
                    <p className="text-neutral-400">
                        Regulatory reporting demands knowing <em>who</em> changed <em>what</em>, <em>when</em>, and <em>why</em>.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="font-mono text-sm space-y-4">
                        <div className="flex gap-4">
                            <span className="text-neutral-500">2023-10-27 10:42:01</span>
                            <span className="text-blue-400">UPDATE</span>
                            <span className="text-neutral-300">Row 020: Paid-up Capital</span>
                        </div>
                        <div className="pl-24 space-y-1">
                            <div className="flex gap-2">
                                <span className="text-neutral-500 w-16">Old:</span>
                                <span className="text-neutral-400">0</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-neutral-500 w-16">New:</span>
                                <span className="text-white">10,000,000</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-neutral-500 w-16">User:</span>
                                <span className="text-neutral-300">analyst@firm.com</span>
                            </div>
                            <div className="mt-2 text-xs text-neutral-500 bg-neutral-950 p-3 rounded border border-neutral-800">
                                Reasoning: Updated based on Q3 Balance Sheet finalisation.
                                <br />
                                Evidence: "Company Alpha has 10M in paid-up capital..."
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scope & Limitations */}
            <section className="py-20 px-6 border-t border-white/5 bg-neutral-950">
                <div className="max-w-4xl mx-auto bg-amber-900/10 border border-amber-500/20 rounded-xl p-8">
                    <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        Prototype Limitations
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-neutral-400 text-sm">
                        <li>This is a technical prototype for a UK PRA COREP internship assessment.</li>
                        <li>Limited to COREP Template C 01.00 (Own Funds) and C 07.00 (Capital Requirements).</li>
                        <li>Does not replace professional regulatory judgement or guarantee compliance.</li>
                        <li>Intended to demonstrate responsible AI architecture in a regulated domain.</li>
                    </ul>
                </div>
            </section>

            {/* Closing */}
            <footer className="py-20 px-6 text-center border-t border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Experience the Prototype</h2>
                <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                    A demonstration of how LLMs can securely and effectively support the work of regulatory analysts.
                </p>
                <SignIn />
                <div className="mt-12 text-xs text-neutral-600">
                    © 2024 COREP ASSIST Prototype. Built for Assessment.
                </div>
            </footer>
        </div>
    );
}
