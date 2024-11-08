// src/component/Module/Record/RecordTableDisplay.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecordTableDisplayProps {
  data: any[];
  startIndex: number;
}

export default function RecordTableDisplay({
  data,
  startIndex,
}: RecordTableDisplayProps) {
  return (
    <div id="table-record">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Object Type</TableHead>
            <TableHead>Object ID</TableHead>
            <TableHead>Object Group</TableHead>
            <TableHead>Object Code</TableHead>
            <TableHead>Record Date</TableHead>
            <TableHead>Record Task ID</TableHead>
            <TableHead>Record No</TableHead>
            <TableHead>Record By</TableHead>
            <TableHead>Record Description</TableHead>
            <TableHead>Record Notes</TableHead>
            <TableHead>Record Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{record.objecttype}</TableCell>
              <TableCell>{record.objectid}</TableCell>
              <TableCell>{record.objectgroup}</TableCell>
              <TableCell>{record.objectcode}</TableCell>
              <TableCell>{record.recorddate}</TableCell>
              <TableCell>{record.recordtaskid}</TableCell>
              <TableCell>{record.recordno}</TableCell>
              <TableCell>{record.recordby}</TableCell>
              <TableCell>{record.recorddescription}</TableCell>
              <TableCell>{record.recordnotes}</TableCell>
              <TableCell>{record.recordstatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
