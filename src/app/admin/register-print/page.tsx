import { getAllMembersForRegistry } from '@/actions/admin';
import { redirect } from 'next/navigation';

export default async function RegisterPrintPage() {
    const res = await getAllMembersForRegistry();

    if (res.error) {
        return <div className="p-10 text-red-600">Greška: {res.error}</div>;
    }

    const { profiles, family, companies } = res.data!;

    // Helper to find family members for a profile
    const getFamily = (userId: string) => family.filter((f: any) => f.head_of_household === userId);

    // Helper to check if user is a company rep
    const getCompany = (userId: string) => companies.find((c: any) => c.representative_id === userId);

    const currentDate = new Date().toLocaleDateString('hr-HR');

    return (
        <div className="bg-white text-black p-8 min-h-screen font-serif">
            {/* PRINT CONTROLS (Hidden when printing) */}
            <div className="print:hidden mb-8 border-b pb-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">Pregled Prije Ispisa</h1>
                    <p className="text-sm text-gray-500">Koristite Ctrl+P ili gumb za ispis.</p>
                </div>
                <button
                    id="print-btn"
                    className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800"
                >
                    ISPIS (PRINT)
                </button>
                <script dangerouslySetInnerHTML={{
                    __html: `
                    document.getElementById('print-btn').onclick = () => window.print();
                `}} />
            </div>

            {/* HEADER */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">Registar Članova</h1>
                <h2 className="text-lg">Udruga Građana Baljci</h2>
                <p className="text-sm mt-2">Datum ispisa: {currentDate}</p>
            </div>

            {/* TABLE */}
            <table className="w-full text-left text-xs border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="py-2 px-1 w-[5%] font-bold">R.br.</th>
                        <th className="py-2 px-1 w-[25%] font-bold">Ime i Prezime / Naziv</th>
                        <th className="py-2 px-1 w-[15%] font-bold">OIB</th>
                        <th className="py-2 px-1 w-[15%] font-bold">Datum Rođenja</th>
                        <th className="py-2 px-1 w-[20%] font-bold">Adresa</th>
                        <th className="py-2 px-1 w-[10%] font-bold">Kategorija</th>
                        <th className="py-2 px-1 w-[10%] font-bold">Datum Upisa</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map((member: any, index: number) => {
                        const company = getCompany(member.id);
                        const famMembers = getFamily(member.id);
                        const isCompany = !!company;
                        const joinDate = new Date(member.created_at).toLocaleDateString('hr-HR');
                        const dob = member.date_of_birth ? new Date(member.date_of_birth).toLocaleDateString('hr-HR') : '-';

                        return (
                            <>
                                {/* MAIN MEMBER ROW */}
                                <tr key={member.id} className="border-b border-gray-300">
                                    <td className="py-2 px-1 align-top">{index + 1}.</td>
                                    <td className="py-2 px-1 align-top font-semibold">
                                        {isCompany ? company.company_name : member.full_name || member.display_name || '-'}
                                        {isCompany && <div className="text-[10px] font-normal italic">Zastupnik: {member.full_name}</div>}
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        {isCompany ? company.company_oib : member.oib || '-'}
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        {isCompany ? '-' : dob}
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        {isCompany ? company.address : member.address || '-'}
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        {member.role === 'admin' ? 'Administrator' :
                                            isCompany ? 'Pravna Osoba' :
                                                member.membership_tier === 'free' ? 'Redovni' :
                                                    member.membership_tier.toUpperCase()}
                                    </td>
                                    <td className="py-2 px-1 align-top">
                                        {joinDate}
                                    </td>
                                </tr>

                                {/* FAMILY MEMBERS ROWS (Indented) */}
                                {famMembers.map((fam: any, fIdx: number) => (
                                    <tr key={fam.id} className="border-b border-gray-100/50 text-[10px] text-gray-600 bg-gray-50/30 print:bg-transparent">
                                        <td className="py-1 px-1"></td>
                                        <td className="py-1 px-1 pl-4 flex items-center">
                                            <span className="mr-1">↳</span> {fam.full_name} ({fam.relationship === 'child' ? 'Dijete' : fam.relationship})
                                        </td>
                                        <td className="py-1 px-1">{fam.oib || '-'}</td>
                                        <td className="py-1 px-1">{new Date(fam.date_of_birth).toLocaleDateString('hr-HR')}</td>
                                        <td className="py-1 px-1 text-gray-400">"</td>
                                        <td className="py-1 px-1">Obiteljski</td>
                                        <td className="py-1 px-1">{joinDate}</td>
                                    </tr>
                                ))}
                            </>
                        );
                    })}
                </tbody>
            </table>

            {/* FOOTER */}
            <div className="mt-12 pt-8 border-t border-black flex justify-between text-xs">
                <div>
                    <p>Za Udrugu Građana Baljci:</p>
                    <p className="mt-8">_________________________</p>
                    <p>(Potpis Ovlaštene Osobe)</p>
                </div>
                <div className="text-right">
                    <p>MP</p>
                    <p className="mt-8">(Pečat)</p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 1cm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
