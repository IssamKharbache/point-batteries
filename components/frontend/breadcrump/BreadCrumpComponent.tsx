import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
interface BreadCrumpComponentProps {
  links: [{ name: string; href?: string }];
}

const BreadCrumpComponent = ({ links }: BreadCrumpComponentProps) => {
  return (
    <Breadcrumb className="ml-8">
      <BreadcrumbList>
        <BreadcrumbLink href="/">
          <BreadcrumbItem>Accueil</BreadcrumbItem>
        </BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {links.map((link, idx) => (
            <BreadcrumbLink key={idx} href={link.href}>
              {link.name}
            </BreadcrumbLink>
          ))}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumpComponent;
