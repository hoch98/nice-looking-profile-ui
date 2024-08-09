import { Box } from "@mui/joy";

export default async function Template({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // TODO Make it possible to set boundaries to where the sidebar ends.
  // TODO Suggestion: Use tables and thus columns.
  return (
    <div>
      <Box
        sx={{
          marginLeft: "1rem",
          marginTop: "3rem",
          padding: "1px 16px",
          minHeight: "10px",
        }}
      >
        {children}
      </Box>
    </div>
  );
}
