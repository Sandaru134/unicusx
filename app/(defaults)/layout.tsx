import ContentAnimation from '@/components/layouts/content-animation';


export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <ContentAnimation>{children}</ContentAnimation>
    ) ;
}
