import AIDashboard from '../components/AI/AIDashboard';

export default function AIPage() {
    return <AIDashboard />;
}

export async function getServerSideProps(context) {
    // Pass any server-side props if needed
    return {
        props: {
            // Your props here
        },
    };
}