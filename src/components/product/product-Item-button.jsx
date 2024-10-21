import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Iconify } from '../iconify';

const ProductItemButton = ({
  payload,
  image,
  productName,
  handleClick,
  handleDelete,
  selected,
  deletedAction,
  deletedImages,
}) => {
  const previewUrl = typeof image === 'string' ? image : URL.createObjectURL(image);

  const theme = useTheme();

  const PRIMARY_MAIN = theme.vars.palette.primary.main;

  const DELETE_MAIN = theme.vars.palette.error.main;

  const isDeleted = () => {
    const objectExists = deletedImages.some((item) => item === payload);
    if (objectExists) {
      return DELETE_MAIN;
    }
    return '';
  };

  return (
    <Box
      gap={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        position: 'relative',
        backgroundColor: deletedAction ? isDeleted : selected ? PRIMARY_MAIN : '',
        p: 3,
        borderRadius: 1,
        overflow: 'hidden',
        border: (thm) => `solid 1px ${thm.vars.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'inline-flex', width: 65, height: 65 }}>
        {deletedAction && (
          <Box
            sx={{
              padding: 0.5,
              margin: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              color: 'error.main',
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              // ':hover': {
              //   backgroundColor: 'rgba(0, 0, 0, 0.2)',
              // },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </Box>
        )}

        <Box
          onClick={() => {
            if (deletedAction) {
              handleDelete(payload);
            } else {
              handleClick(payload);
            }
          }}
          component="img"
          src={previewUrl}
          sx={{
            width: 1,
            height: 1,
            objectFit: 'cover',
            borderRadius: 2,
          }}
        />
      </Box>
      {productName && (
        <Box
          component="span"
          sx={{
            height: 24,
            textAlign: 'center',
            lineHeight: '24px',
            fontSize: (thm) => thm.typography.subtitle2.fontSize,
            fontWeight: (thm) => thm.typography.subtitle2.fontWeight,
          }}
        >
          {productName}
        </Box>
      )}
    </Box>
  );
};
export default ProductItemButton;
