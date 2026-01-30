import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UploadedFile,
    UseInterceptors,
    ParseIntPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { v4 as uuid } from 'uuid';
  
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    // cấu hình upload (dùng chung)
    private static fileStorage = diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${uuid()}${extname(file.originalname)}`;
        cb(null, filename);
      },
    });
  
    // CREATE
    @Post()
    @UseInterceptors(
      FileInterceptor('image', {
        storage: ProductsController.fileStorage,
      }),
    )
    create(
      @Body() dto: CreateProductDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      return this.productsService.create(dto, file?.filename);
    }
  
    // READ ALL
    @Get()
    findAll() {
      return this.productsService.findAll();
    }
  
    // UPDATE
    @Put(':id')
    @UseInterceptors(
      FileInterceptor('image', {
        storage: ProductsController.fileStorage,
      }),
    )
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateProductDto,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      return this.productsService.update(id, dto, file?.filename);
    }
  
    // DELETE
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.remove(id);
    }
  }
  