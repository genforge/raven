import { WebhookItem } from "@/components/feature/integrations/webhooks/WebhookItem"
import { ErrorBanner } from "@/components/layout/AlertBanner/ErrorBanner"
import { TableLoader } from "@/components/layout/Loaders/TableLoader"
import PageContainer from "@/components/layout/Settings/PageContainer"
import SettingsContentContainer from "@/components/layout/Settings/SettingsContentContainer"
import SettingsPageHeader from "@/components/layout/Settings/SettingsPageHeader"
import { RavenWebhook } from "@/types/RavenIntegrations/RavenWebhook"
import { isSystemManager } from "@/utils/roles"
import { Flex, Button } from "@radix-ui/themes"
import { useFrappeDocTypeEventListener, useFrappeGetDocList } from "frappe-react-sdk"
import { Link } from "react-router-dom"

const WebhookList = () => {

    const isRavenAdmin = isSystemManager()

    const { data, error, isLoading, mutate } = useFrappeGetDocList<RavenWebhook>('Raven Webhook', {
        fields: ['name', 'request_url', 'enabled', 'owner', 'creation']
    }, isRavenAdmin ? undefined : null, {
        errorRetryCount: 2
    })

    useFrappeDocTypeEventListener('Raven Webhook', () => {
        mutate()
    })

    return (
        <PageContainer>
            <SettingsContentContainer>
                <SettingsPageHeader
                    title='Webhooks'
                    description='Fire webhooks on specific events like when a message is sent or channel is created.'
                    actions={<Button asChild disabled={!isRavenAdmin}>
                        <Link to='create'>Create</Link>
                    </Button>}
                />
                {isLoading && !error && <TableLoader columns={2} />}
                <ErrorBanner error={error} />
                {data?.length === 0 ? null : <Flex direction='column' gap='4' width='100%' className="animate-fadein">
                    {data?.map((webhook, index) => (
                        <WebhookItem key={index} webhook={webhook} mutate={mutate} />
                    ))}
                </Flex>}
            </SettingsContentContainer>
        </PageContainer>
    )
}

export const Component = WebhookList