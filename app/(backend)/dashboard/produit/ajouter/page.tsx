import AjouterProduit from "@/components/backend/forms/AjouterProduit";
import PageHeader from "@/components/backend/UI/PageHeader";
import UploadImageButton from "@/components/backend/upload/UploadImageButton";

const page = () => {
  return (
    <section>
      <PageHeader name="Ajouter produit" />
      <div className="flex flex-col items-center justify-center mt-8 w-full">
        <AjouterProduit />
      </div>
    </section>
  );
};

export default page;
