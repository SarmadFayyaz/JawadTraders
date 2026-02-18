export interface Client {
  id: string
  name: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface ClientItem {
  id: string
  client_id: string
  item_name: string
  quantity: number
  date: string
  created_at: string
}

export interface Vegetable {
  id: string
  name: string
  qty_bought: number
  qty_sold: number
  price_bought: number
  price_sold: number
  date: string
  created_at: string
}

export type ChickenRecordType = 'bought' | 'sold'

export interface ChickenRecord {
  id: string
  type: ChickenRecordType
  quantity: number
  weight_kg: number
  price: number
  date: string
  created_at: string
}

export interface VegetableName {
  id: string
  name: string
  unit: string
  created_at: string
}

export interface CylinderType {
  id: string
  name: string
  weight_kg: number
  cylinder_price: number
  gas_price: number
  no_of_cylinders: number
  created_at: string
  updated_at: string
}

export interface CylinderAssignment {
  id: string
  client_id: string
  cylinder_type_id: string
  quantity: number
  date: string
  created_at: string
}

export interface Customer {
  id: string
  name: string
  phone: string | null
  balance: number
  created_at: string
  updated_at: string
}

export interface DailySaleSheet {
  id: string
  date: string
  total_cylinders: number
  total_gas_kg: number
  created_at: string
}

export type SaleType = 'gas' | 'other'

export interface DailySale {
  id: string
  date: string
  customer_id: string
  sale_type: SaleType
  gas_kg: number | null
  total_amount: number
  paid: number
  remaining: number
  created_at: string
}

export interface DailySaleWithCustomer extends DailySale {
  customers: Pick<Customer, 'name' | 'phone'>
}

export interface Employee {
  id: string
  name: string
  phone: string | null
  created_at: string
  updated_at: string
}

export interface SalaryRecord {
  id: string
  employee_id: string
  month: string
  total_pay: number
  paid: number
  remaining: number
  created_at: string
  updated_at: string
}

export interface SalaryRecordWithEmployee extends SalaryRecord {
  employees: Pick<Employee, 'name' | 'phone'>
}

export interface Supplier {
  id: string
  name: string
  phone: string | null
  total_bill: number
  paid: number
  remaining: number
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
      }
      client_items: {
        Row: ClientItem
        Insert: Omit<ClientItem, 'id' | 'created_at'>
        Update: Partial<Omit<ClientItem, 'id' | 'created_at'>>
      }
      vegetables: {
        Row: Vegetable
        Insert: Omit<Vegetable, 'id' | 'created_at'>
        Update: Partial<Omit<Vegetable, 'id' | 'created_at'>>
      }
      chicken_records: {
        Row: ChickenRecord
        Insert: Omit<ChickenRecord, 'id' | 'created_at'>
        Update: Partial<Omit<ChickenRecord, 'id' | 'created_at'>>
      }
      vegetable_names: {
        Row: VegetableName
        Insert: Omit<VegetableName, 'id' | 'created_at'>
        Update: Partial<Omit<VegetableName, 'id' | 'created_at'>>
      }
      cylinder_types: {
        Row: CylinderType
        Insert: Omit<CylinderType, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CylinderType, 'id' | 'created_at' | 'updated_at'>>
      }
      cylinder_assignments: {
        Row: CylinderAssignment
        Insert: Omit<CylinderAssignment, 'id' | 'created_at'>
        Update: Partial<Omit<CylinderAssignment, 'id' | 'created_at'>>
      }
      customers: {
        Row: Customer
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>
      }
      daily_sale_sheets: {
        Row: DailySaleSheet
        Insert: Omit<DailySaleSheet, 'id' | 'created_at'>
        Update: Partial<Omit<DailySaleSheet, 'id' | 'created_at'>>
      }
      daily_sales: {
        Row: DailySale
        Insert: Omit<DailySale, 'id' | 'created_at'>
        Update: Partial<Omit<DailySale, 'id' | 'created_at'>>
      }
      employees: {
        Row: Employee
        Insert: Omit<Employee, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>
      }
      salary_records: {
        Row: SalaryRecord
        Insert: Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SalaryRecord, 'id' | 'created_at' | 'updated_at'>>
      }
      suppliers: {
        Row: Supplier
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
