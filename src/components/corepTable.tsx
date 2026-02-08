export default function CorepTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full border text-sm">
      <thead>
        <tr>
          <th>Row</th>
          <th>Item</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.rowCode}>
            <td>{r.rowCode}</td>
            <td>{r.item}</td>
            <td>{r.amount || "—"}</td>
            <td>{r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
