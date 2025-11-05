/**
 * CONTRACTS LIST PAGE
 * ===================
 * Comprehensive table view of all contracts across all deals.
 *
 * Features:
 * - Table view of all contracts
 * - Filters by deal, status, contract type
 * - Search by contract name
 * - Sort by various columns
 * - Click to navigate to contract collaboration page
 * - Responsive design
 *
 * Route: /contracts
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ExternalLink,
  Users
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// ============================================================================
// TYPES
// ============================================================================

interface Contract {
  contract_id: string
  contract_name: string
  contract_type: 'Murabaha' | 'Mudaraba' | 'Musharaka' | 'Ijara' | 'Sukuk' | 'Other'
  deal_id?: string
  deal_name?: string
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Active' | 'Completed'
  owner_email: string
  owner_name: string
  created_at: string
  updated_at: string
  stakeholders_count: number
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ContractsListPage() {
  const searchParams = useSearchParams()

  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dealFilter, setDealFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'date' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // ============================================================================
  // URL QUERY PARAMETER HANDLING
  // ============================================================================

  // Apply deal filter from URL query parameter on mount
  useEffect(() => {
    const dealParam = searchParams.get('deal')
    if (dealParam) {
      setDealFilter(dealParam)
    }
  }, [searchParams])

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadContracts()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [contracts, searchQuery, statusFilter, typeFilter, dealFilter, sortBy, sortOrder])

  const loadContracts = async () => {
    try {
      setLoading(true)

      // TODO: Replace with real API call when available
      // const data = await backendClient.api<{ contracts: Contract[] }>(
      //   '/api/contracts',
      //   { method: 'GET' }
      // )

      // Mock data for now
      const mockContracts: Contract[] = [
        {
          contract_id: 'contract-001',
          contract_name: 'Master Murabaha Agreement',
          contract_type: 'Murabaha',
          deal_id: 'deal-mock-001',
          deal_name: 'Mock QIIB Oryx Sustainability Sukuk',
          status: 'Active',
          owner_email: 'owner1@example.com',
          owner_name: 'Ahmed Al-Mansoori',
          created_at: new Date('2024-01-15').toISOString(),
          updated_at: new Date('2024-02-01').toISOString(),
          stakeholders_count: 5,
        },
        {
          contract_id: 'contract-002',
          contract_name: 'Mudaraba Partnership Contract',
          contract_type: 'Mudaraba',
          deal_id: 'deal-mock-001',
          deal_name: 'Mock QIIB Oryx Sustainability Sukuk',
          status: 'In Review',
          owner_email: 'owner2@example.com',
          owner_name: 'Fatima Al-Hashemi',
          created_at: new Date('2024-02-10').toISOString(),
          updated_at: new Date('2024-02-15').toISOString(),
          stakeholders_count: 3,
        },
        {
          contract_id: 'contract-003',
          contract_name: 'Ijarah Lease Agreement',
          contract_type: 'Ijara',
          deal_id: 'deal-mock-002',
          deal_name: 'Mock UAE Green Ijarah',
          status: 'Completed',
          owner_email: 'owner3@example.com',
          owner_name: 'Khalid Al-Nuaimi',
          created_at: new Date('2023-12-01').toISOString(),
          updated_at: new Date('2024-01-20').toISOString(),
          stakeholders_count: 7,
        },
        {
          contract_id: 'contract-004',
          contract_name: 'Sukuk Issuance Agreement',
          contract_type: 'Sukuk',
          status: 'Draft',
          owner_email: 'owner4@example.com',
          owner_name: 'Sara Al-Kuwari',
          created_at: new Date('2024-03-01').toISOString(),
          updated_at: new Date('2024-03-05').toISOString(),
          stakeholders_count: 2,
        },
        {
          contract_id: 'contract-005',
          contract_name: 'Musharaka Joint Venture',
          contract_type: 'Musharaka',
          deal_id: 'deal-mock-001',
          deal_name: 'Mock QIIB Oryx Sustainability Sukuk',
          status: 'Approved',
          owner_email: 'owner5@example.com',
          owner_name: 'Mohammed Al-Thani',
          created_at: new Date('2024-02-20').toISOString(),
          updated_at: new Date('2024-03-10').toISOString(),
          stakeholders_count: 4,
        },
      ]

      setContracts(mockContracts)
    } catch (error) {
      console.error('Failed to load contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...contracts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.contract_name.toLowerCase().includes(query) ||
        c.contract_id.toLowerCase().includes(query) ||
        c.deal_name?.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.contract_type === typeFilter)
    }

    // Filter by deal
    if (dealFilter !== 'all') {
      filtered = filtered.filter(c => c.deal_id === dealFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.contract_name.localeCompare(b.contract_name)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'type':
          comparison = a.contract_type.localeCompare(b.contract_type)
          break
        case 'date':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    setFilteredContracts(filtered)
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getContractTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Murabaha: 'bg-blue-100 text-blue-800',
      Mudaraba: 'bg-green-100 text-green-800',
      Musharaka: 'bg-purple-100 text-purple-800',
      Ijara: 'bg-orange-100 text-orange-800',
      Sukuk: 'bg-pink-100 text-pink-800',
      Other: 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Draft': 'bg-gray-100 text-gray-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Active': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const toggleSort = (field: 'name' | 'status' | 'date' | 'type') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getUniqueDeals = () => {
    const deals = new Set<string>()
    contracts.forEach(c => {
      if (c.deal_id && c.deal_name) {
        deals.add(JSON.stringify({ id: c.deal_id, name: c.deal_name }))
      }
    })
    return Array.from(deals).map(d => JSON.parse(d))
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="container mx-auto py-8 max-w-7xl space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Contracts' }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Contracts
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-xs text-gray-500">All contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {contracts.filter(c => c.status === 'Active').length}
            </div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {contracts.filter(c => c.status === 'In Review').length}
            </div>
            <p className="text-xs text-gray-500">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts.filter(c => c.status === 'Draft').length}
            </div>
            <p className="text-xs text-gray-500">In draft stage</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Murabaha">Murabaha</SelectItem>
                <SelectItem value="Mudaraba">Mudaraba</SelectItem>
                <SelectItem value="Musharaka">Musharaka</SelectItem>
                <SelectItem value="Ijara">Ijara</SelectItem>
                <SelectItem value="Sukuk">Sukuk</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Deal Filter */}
            <Select value={dealFilter} onValueChange={setDealFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All deals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deals</SelectItem>
                {getUniqueDeals().map(deal => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.name}
                  </SelectItem>
                ))}
                <SelectItem value="none">No Deal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dealFilter !== 'all') && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {searchQuery && (
                <Badge variant="outline">Search: {searchQuery}</Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="outline">Status: {statusFilter}</Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="outline">Type: {typeFilter}</Badge>
              )}
              {dealFilter !== 'all' && (
                <Badge variant="outline">
                  Deal: {dealFilter === 'none' ? 'No Deal' : getUniqueDeals().find(d => d.id === dealFilter)?.name}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                  setDealFilter('all')
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contracts List
          </CardTitle>
          <CardDescription>
            Click on any contract to view details and collaborate
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading contracts...
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dealFilter !== 'all'
                  ? 'No contracts match your filters'
                  : 'No contracts yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-semibold"
                        onClick={() => toggleSort('name')}
                      >
                        Contract Name
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-semibold"
                        onClick={() => toggleSort('type')}
                      >
                        Type
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Deal</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-semibold"
                        onClick={() => toggleSort('status')}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Stakeholders</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-semibold"
                        onClick={() => toggleSort('date')}
                      >
                        Last Updated
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow
                      key={contract.contract_id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => window.location.href = `/contracts/${contract.contract_id}/collaborate`}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{contract.contract_name}</div>
                          <div className="text-xs text-gray-500">{contract.contract_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getContractTypeColor(contract.contract_type)}>
                          {contract.contract_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {contract.deal_name ? (
                          <Link
                            href={`/deals/${contract.deal_id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contract.deal_name}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="text-gray-400 text-sm">No deal</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{contract.owner_name}</div>
                          <div className="text-gray-500 text-xs">{contract.owner_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-3 w-3" />
                          {contract.stakeholders_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(contract.updated_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/contracts/${contract.contract_id}/collaborate`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
