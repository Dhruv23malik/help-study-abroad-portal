"use client";

import { memo, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  InputAdornment,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useUsersStore, type DummyUser } from "@/store/users-store";

const PAGE_SIZE = 10;

const UserTableRow = memo(function UserTableRow({ user }: { user: DummyUser }) {
  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 38, height: 38 }} />
          <Box>
            <Typography sx={{ fontWeight: 650 }}>{user.firstName} {user.lastName}</Typography>
            <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell><Chip size="small" label={user.gender} sx={{ textTransform: "capitalize" }} /></TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company?.name ?? "—"}</TableCell>
      <TableCell align="right">
        <Button component={NextLink} href={`/users/${user.id}`} size="small" endIcon={<ArrowForwardRoundedIcon />}>View</Button>
      </TableCell>
    </TableRow>
  );
});

const UserMobileCard = memo(function UserMobileCard({ user }: { user: DummyUser }) {
  return (
    <Card>
      <CardActionArea component={NextLink} href={`/users/${user.id}`} sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 46, height: 46 }} />
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 700 }}>{user.firstName} {user.lastName}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
            </Box>
            <ArrowForwardRoundedIcon color="action" fontSize="small" />
          </Stack>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip size="small" label={user.gender} sx={{ textTransform: "capitalize" }} />
            <Chip size="small" variant="outlined" label={user.phone} />
          </Stack>
          <Typography variant="body2" color="text.secondary">{user.company?.name ?? "No company listed"}</Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
});

export function UsersList() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const users = useUsersStore((state) => state.users);
  const total = useUsersStore((state) => state.total);
  const isLoading = useUsersStore((state) => state.isLoading);
  const error = useUsersStore((state) => state.error);
  const fetchUsers = useUsersStore((state) => state.fetchUsers);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    void fetchUsers({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, search });
  }, [fetchUsers, page, search]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: { xs: "stretch", sm: "end" }, flexDirection: { xs: "column", sm: "row" } }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 42 }, mb: 0.75 }}>Users</Typography>
          <Typography color="text.secondary">Search, browse, and inspect user profiles.</Typography>
        </Box>
        <TextField
          value={input}
          onChange={(event) => { setInput(event.target.value); setPage(0); }}
          placeholder="Search users"
          size="small"
          sx={{ width: { xs: "100%", sm: 310 } }}
          slotProps={{
            htmlInput: { "aria-label": "Search users" },
            input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> },
          }}
        />
      </Box>

      {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void fetchUsers({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, search })}>Retry</Button>}>{error}</Alert>}

      <Box sx={{ display: { xs: "grid", md: "none" }, gap: 1.5 }}>
        {isLoading && users.length === 0
          ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} variant="rounded" height={130} />)
          : users.map((user) => <UserMobileCard key={user.id} user={user} />)}
        {!isLoading && users.length === 0 && <Card sx={{ p: 3, textAlign: "center" }}><Typography color="text.secondary">No users match this search.</Typography></Card>}
      </Box>

      <TableContainer component={Card} sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}>
        <Table aria-label="Users">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafbf9" }}>
              <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Gender</TableCell><TableCell>Phone</TableCell><TableCell>Company</TableCell><TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && users.length === 0
              ? Array.from({ length: 6 }, (_, index) => <TableRow key={index}><TableCell colSpan={6}><Skeleton /></TableCell></TableRow>)
              : users.map((user) => <UserTableRow key={user.id} user={user} />)}
            {!isLoading && users.length === 0 && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>No users match this search.</TableCell></TableRow>}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
        />
      </TableContainer>

      <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="body2" color="text.secondary">Page {page + 1} of {pageCount}</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <Button variant="outlined" disabled={(page + 1) * PAGE_SIZE >= total} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </Stack>
      </Box>
    </Stack>
  );
}
