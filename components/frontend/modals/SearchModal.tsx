import SearchBar from "../navbar/SearchBar";

interface SearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModal = ({ open, setOpen }: SearchModalProps) => {
  return <SearchBar open={open} setOpen={setOpen} />;
};

export default SearchModal;
