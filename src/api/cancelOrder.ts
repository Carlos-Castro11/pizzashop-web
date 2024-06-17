import { api } from '@/lib/axios'

export interface CancelOrderParams {
    orderId: string
}

export async function GetCancelOrderFn({ orderId }: CancelOrderParams) {
    await api.patch(`orders/${orderId}/cancel`)
}
